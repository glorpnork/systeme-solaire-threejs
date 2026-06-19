import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Contrôles caméra desktop : OrbitControls (souris) + déplacement clavier (ZQSD/flèches/espace/shift)
export function setupControls(camera, renderer) {
  const controls = new OrbitControls(camera, renderer.domElement);

  controls.enableDamping = true;     // inertie/amortissement des mouvements
  controls.dampingFactor = 0.05;
  controls.enableZoom = true;
  controls.zoomSpeed = 1.2;
  controls.enableRotate = true;
  controls.rotateSpeed = 0.8;
  controls.enablePan = false;
  controls.minDistance = 30;         // zoom min/max
  controls.maxDistance = 5000;
  controls.target = new THREE.Vector3(0, 0, 0); // point regardé, centré sur le Soleil

  // État des touches clavier (true = appuyée)
  const keys = {};
  window.addEventListener('keydown', (e) => { keys[e.key.toLowerCase()] = true; });
  window.addEventListener('keyup', (e) => { keys[e.key.toLowerCase()] = false; });

  // Vecteurs réutilisés à chaque frame (évite des allocations)
  const _fwd = new THREE.Vector3();
  const _right = new THREE.Vector3();

  // Déplace la caméra ET la cible des OrbitControls ensemble (effet "marche")
  function updateKeyboardMovement() {
    const speed = 4;

    // Direction avant de la caméra, projetée à l'horizontale
    camera.getWorldDirection(_fwd);
    _fwd.y = 0;
    if (_fwd.lengthSq() > 0.001) _fwd.normalize();

    // Direction droite de la caméra (axe X local tourné selon son orientation)
    _right.set(1, 0, 0).applyQuaternion(camera.quaternion);
    _right.y = 0;
    if (_right.lengthSq() > 0.001) _right.normalize();

    if (keys['z'] || keys['arrowup']) {
      camera.position.addScaledVector(_fwd, speed);
      controls.target.addScaledVector(_fwd, speed);
    }
    if (keys['s'] || keys['arrowdown']) {
      camera.position.addScaledVector(_fwd, -speed);
      controls.target.addScaledVector(_fwd, -speed);
    }
    if (keys['q'] || keys['arrowleft']) {
      camera.position.addScaledVector(_right, -speed);
      controls.target.addScaledVector(_right, -speed);
    }
    if (keys['d'] || keys['arrowright']) {
      camera.position.addScaledVector(_right, speed);
      controls.target.addScaledVector(_right, speed);
    }
    if (keys[' ']) {
      camera.position.y += speed;
      controls.target.y += speed;
    }
    if (keys['shift']) {
      camera.position.y -= speed;
      controls.target.y -= speed;
    }
  }

  // Boucle dédiée aux contrôles, indépendante de la boucle de rendu principale
  function animateControls() {
    if (controls.enabled) {
      updateKeyboardMovement();
      controls.update(); // applique le damping
    }
    requestAnimationFrame(animateControls);
  }
  animateControls();

  return { controls };
}
