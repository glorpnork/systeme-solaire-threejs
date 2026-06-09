import * as THREE from 'three';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js';
import { PLANET_DATA } from '../data/planetData.js';
import { createInfoPanel } from './infoPanel.js';

export function setupInteraction(renderer, scene, camera, cameraRig, planetMeshes, orbitControls, speedState) {
  const infoPanel = createInfoPanel(scene, renderer);

  // Zoom
  let zoomActive = false;
  const zoomFrom = new THREE.Vector3();
  const zoomTo = new THREE.Vector3();
  const zoomPlanetPos = new THREE.Vector3();
  let zoomStartTime = 0;
  const ZOOM_DURATION = 1800;

  // Highlight
  let highlighted = null;
  const savedEmissive = new Map();

  // Audio
  let audioCtx = null;
  function getAudioCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
  }
  function playClick() {
    try {
      const ctx = getAudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.28, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.38);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
    } catch (_) {}
  }

  let frVoice = null;
  function loadVoices() {
    frVoice = (window.speechSynthesis?.getVoices() || []).find(v => v.lang.startsWith('fr')) || null;
  }
  if (window.speechSynthesis) {
    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
  }
  function speak(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'fr-FR'; utt.rate = 0.88; utt.pitch = 1.0;
    if (frVoice) utt.voice = frVoice;
    window.speechSynthesis.speak(utt);
  }

  // Highlight helpers
  function setHighlight(mesh) {
    clearHighlight();
    highlighted = mesh;
    if (mesh.material?.emissive) {
      savedEmissive.set(mesh, mesh.material.emissive.clone());
      mesh.material.emissive.setHex(0x223355);
    }
  }
  function clearHighlight() {
    if (!highlighted) return;
    const orig = savedEmissive.get(highlighted);
    if (highlighted.material?.emissive && orig) highlighted.material.emissive.copy(orig);
    savedEmissive.delete(highlighted);
    highlighted = null;
  }

  // Planet selection
  function selectPlanet(mesh) {
    const data = PLANET_DATA[mesh.userData.name];
    if (!data) return;
    setHighlight(mesh);
    playClick();
    speak(data.audioText);
    infoPanel.show(data, mesh);

    const wp = new THREE.Vector3();
    mesh.getWorldPosition(wp);
    const radius = mesh.userData.radius || 10;
    const dir = new THREE.Vector3().subVectors(wp, camera.position).normalize();

    zoomFrom.copy(camera.position);
    zoomTo.copy(wp).sub(dir.multiplyScalar(radius * 4 + 5));
    zoomPlanetPos.copy(wp);
    zoomStartTime = performance.now();
    zoomActive = true;
    if (orbitControls) orbitControls.enabled = false;
  }

  function deselect() {
    clearHighlight();
    infoPanel.hide();
    window.speechSynthesis?.cancel();
    if (!zoomActive && orbitControls) orbitControls.enabled = true;
  }

  // Mouse (desktop)
  const mouseRay = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let mouseDownX = 0, mouseDownY = 0;

  window.addEventListener('mousedown', e => { mouseDownX = e.clientX; mouseDownY = e.clientY; });
  window.addEventListener('mouseup', e => {
    if (renderer.xr.isPresenting) return;
    const dx = e.clientX - mouseDownX, dy = e.clientY - mouseDownY;
    if (Math.sqrt(dx * dx + dy * dy) > 5) return;
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    mouseRay.setFromCamera(mouse, camera);
    const hits = mouseRay.intersectObjects(planetMeshes);
    hits.length > 0 ? selectPlanet(hits[0].object) : deselect();
  });
  window.addEventListener('keydown', e => { if (e.key === 'Escape') deselect(); });

  // VR controllers
  const modelFactory = new XRControllerModelFactory();
  const tempMatrix = new THREE.Matrix4();
  const controllerRay = new THREE.Raycaster();

  for (let i = 0; i < 2; i++) {
    const controller = renderer.xr.getController(i);
    cameraRig.add(controller);
    const grip = renderer.xr.getControllerGrip(i);
    grip.add(modelFactory.createControllerModel(grip));
    cameraRig.add(grip);

    const lineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -1)
    ]);
    const line = new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: 0x00eeff, transparent: true, opacity: 0.55 }));
    line.scale.z = 400;
    controller.add(line);

    controller.addEventListener('selectstart', () => {
      tempMatrix.identity().extractRotation(controller.matrixWorld);
      controllerRay.ray.origin.setFromMatrixPosition(controller.matrixWorld);
      controllerRay.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);
      const hits = controllerRay.intersectObjects(planetMeshes);
      hits.length > 0 ? selectPlanet(hits[0].object) : deselect();
    });
  }

  // VR HUD vitesse
  const HW = 256, HH = 80;
  const hudCv = document.createElement('canvas');
  hudCv.width = HW; hudCv.height = HH;
  const hudCtx = hudCv.getContext('2d');
  const hudTex = new THREE.CanvasTexture(hudCv);
  const hudMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(0.42, 0.42 * (HH / HW)),
    new THREE.MeshBasicMaterial({ map: hudTex, transparent: true, side: THREE.DoubleSide, depthTest: false })
  );
  hudMesh.renderOrder = 1000;
  hudMesh.visible = false;
  scene.add(hudMesh);

  function drawHUD(speed) {
    hudCtx.clearRect(0, 0, HW, HH);
    hudCtx.fillStyle = 'rgba(5, 15, 40, 0.88)';
    hudCtx.beginPath();
    hudCtx.roundRect(2, 2, HW - 4, HH - 4, 10);
    hudCtx.fill();
    hudCtx.strokeStyle = '#00ccff';
    hudCtx.lineWidth = 2;
    hudCtx.stroke();

    hudCtx.fillStyle = '#88ccff';
    hudCtx.font = '14px Arial';
    hudCtx.textAlign = 'left';
    hudCtx.fillText('Vitesse', 10, 24);

    hudCtx.fillStyle = speed === 0 ? '#ff6655' : '#ffffff';
    hudCtx.font = 'bold 30px Arial';
    hudCtx.textAlign = 'right';
    hudCtx.fillText(speed === 0 ? 'PAUSE' : `×${speed.toFixed(1)}`, HW - 10, 58);

    hudCtx.fillStyle = 'rgba(100, 180, 255, 0.45)';
    hudCtx.font = '11px Arial';
    hudCtx.textAlign = 'center';
    hudCtx.fillText('A : + vitesse   B : − vitesse', HW / 2, HH - 8);
    hudTex.needsUpdate = true;
  }
  drawHUD(speedState?.multiplier ?? 1);

  // VR locomotion
  const MOVE_SPEED = 60; // unités/sec
  const DEADZONE = 0.15;
  const prevBtns = { a: false, b: false };
  const _fwd = new THREE.Vector3();
  const _right = new THREE.Vector3();
  const _xrPos = new THREE.Vector3();
  const _xrQuat = new THREE.Quaternion();
  // Snap turn
  let snapCooldown = 0;

  // Quest/Pico/la plupart : axes[0]=stickX, axes[1]=stickY
  // Valve Index : axes[0/1]=touchpad, axes[2/3]=thumbstick
  // → on garde l'axe avec la plus grande amplitude
  function readStick(axes) {
    const x0 = axes[0] ?? 0, x2 = axes[2] ?? 0;
    const y1 = axes[1] ?? 0, y3 = axes[3] ?? 0;
    return {
      x: Math.abs(x2) > Math.abs(x0) ? x2 : x0,
      y: Math.abs(y3) > Math.abs(y1) ? y3 : y1
    };
  }

  function updateVR(dt) {
    const session = renderer.xr.getSession();
    if (!session) return;

    const xrCam = renderer.xr.getCamera();
    xrCam.getWorldPosition(_xrPos);
    xrCam.getWorldQuaternion(_xrQuat);

    // Direction de déplacement : projection horizontale du regard
    _fwd.set(0, 0, -1).applyQuaternion(_xrQuat);
    _fwd.y = 0;
    if (_fwd.lengthSq() > 0.001) _fwd.normalize();
    _right.set(1, 0, 0).applyQuaternion(_xrQuat);
    _right.y = 0;
    if (_right.lengthSq() > 0.001) _right.normalize();

    snapCooldown = Math.max(0, snapCooldown - dt);

    for (const src of session.inputSources) {
      if (!src.gamepad) continue;
      const { axes, buttons } = src.gamepad;

      const stick = readStick(axes);

      if (src.handedness === 'left') {
        // Stick gauche : avancer/reculer + déplacement latéral
        if (Math.abs(stick.x) > DEADZONE) cameraRig.position.addScaledVector(_right, stick.x * MOVE_SPEED * dt);
        if (Math.abs(stick.y) > DEADZONE) cameraRig.position.addScaledVector(_fwd, -stick.y * MOVE_SPEED * dt);
      }

      if (src.handedness === 'right') {
        // Stick droit Y : monter/descendre
        if (Math.abs(stick.y) > DEADZONE) cameraRig.position.y -= stick.y * MOVE_SPEED * dt;

        // Stick droit X : snap turn 30° — pivot centré sur la tête
        if (snapCooldown === 0 && Math.abs(stick.x) > 0.6) {
          const snapAngle = stick.x > 0 ? -Math.PI / 6 : Math.PI / 6;
          const snapQ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), snapAngle);

          // Vecteur rig→tête en espace monde (plan XZ seulement)
          const rigToHead = new THREE.Vector3().subVectors(_xrPos, cameraRig.position);
          rigToHead.y = 0;
          // Ce vecteur après rotation
          const rigToHeadRotated = rigToHead.clone().applyQuaternion(snapQ);
          // Compensation pour que la tête reste au même endroit
          cameraRig.position.add(rigToHead).sub(rigToHeadRotated);

          cameraRig.quaternion.premultiply(snapQ);
          snapCooldown = 0.35;
        }

        // Bouton A (index 4) : vitesse +0.1
        // Bouton B (index 5) : vitesse −0.1
        const aPressed = buttons[4]?.pressed ?? false;
        const bPressed = buttons[5]?.pressed ?? false;
        if (aPressed && !prevBtns.a && speedState) {
          speedState.multiplier = Math.min(5, parseFloat((speedState.multiplier + 0.1).toFixed(1)));
          drawHUD(speedState.multiplier);
        }
        if (bPressed && !prevBtns.b && speedState) {
          speedState.multiplier = Math.max(0, parseFloat((speedState.multiplier - 0.1).toFixed(1)));
          drawHUD(speedState.multiplier);
        }
        prevBtns.a = aPressed;
        prevBtns.b = bPressed;
      }
    }

    // Position du HUD : coin inférieur-droit du champ de vision
    const fwdFull = new THREE.Vector3(0, 0, -1).applyQuaternion(_xrQuat);
    const downFull = new THREE.Vector3(0, -1, 0).applyQuaternion(_xrQuat);
    const rightFull = new THREE.Vector3(1, 0, 0).applyQuaternion(_xrQuat);
    hudMesh.position.copy(_xrPos)
      .addScaledVector(fwdFull, 1.2)
      .addScaledVector(downFull, 0.28)
      .addScaledVector(rightFull, 0.42);
    hudMesh.lookAt(_xrPos);
    hudMesh.visible = true;
  }

  // Éasing
  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  // Update par frame
  let lastT = null;

  function update() {
    const now = performance.now();
    const dt = lastT ? Math.min((now - lastT) / 1000, 0.1) : 0.016;
    lastT = now;

    if (renderer.xr.isPresenting) {
      updateVR(dt);
      // Sync HUD si la vitesse a changé depuis le slider HTML
      if (speedState) drawHUD(speedState.multiplier);
    } else {
      hudMesh.visible = false;
    }

    if (zoomActive) {
      const t = Math.min((now - zoomStartTime) / ZOOM_DURATION, 1);
      camera.position.lerpVectors(zoomFrom, zoomTo, easeInOutQuad(t));
      if (t >= 1) {
        zoomActive = false;
        if (orbitControls) {
          orbitControls.target.copy(zoomPlanetPos);
          orbitControls.enabled = true;
          orbitControls.update();
        }
      }
    }

    infoPanel.update(camera);
  }

  // Exposer pour sync depuis main.js (ex: mise à jour HUD quand slider change)
  function notifySpeedChange(speed) {
    drawHUD(speed);
  }

  return { update, notifySpeedChange };
}
