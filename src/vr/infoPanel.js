import * as THREE from 'three';

export function createInfoPanel(scene, renderer) {
  // Panneau HTML (mode normal)
  const el = document.createElement('div');
  el.style.cssText = `
    position: fixed;
    top: 50%;
    right: 28px;
    transform: translateY(-50%);
    width: 300px;
    background: rgba(5, 15, 40, 0.92);
    border: 1px solid rgba(0, 200, 255, 0.35);
    border-radius: 16px;
    padding: 20px 22px;
    color: #cce4ff;
    font-family: Arial, sans-serif;
    font-size: 15px;
    line-height: 1.5;
    display: none;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    z-index: 50;
    pointer-events: none;
    box-shadow: 0 0 40px rgba(0, 180, 255, 0.1);
  `;
  document.body.appendChild(el);

  function showHTML(data) {
    const c = data.color || '#00ccff';
    el.style.borderColor = c + '55';
    el.style.boxShadow = `0 0 40px ${c}18`;
    el.innerHTML = `
      <div style="color:${c};font-size:22px;font-weight:bold;margin-bottom:12px;letter-spacing:0.04em">${data.name}</div>
      <div style="border-bottom:1px solid ${c}44;margin-bottom:14px"></div>
      ${(data.facts || []).map(f =>
        `<div style="margin-bottom:8px">• ${f}</div>`
      ).join('')}
      <div style="margin-top:14px;font-size:12px;opacity:0.4;text-align:right">ESC ou clic ailleurs pour fermer</div>
    `;
    el.style.display = 'block';
  }

  // Panneau 3D (mode VR)
  const W = 512, H = 300;
  const cv = document.createElement('canvas');
  cv.width = W;
  cv.height = H;
  const ctx = cv.getContext('2d');

  const texture = new THREE.CanvasTexture(cv);
  const PANEL_W = 50; // unités scène – lisible en VR
  const geo = new THREE.PlaneGeometry(PANEL_W, PANEL_W * (H / W));
  const mat = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    depthTest: false
  });
  const panel3d = new THREE.Mesh(geo, mat);
  panel3d.visible = false;
  panel3d.renderOrder = 999;
  scene.add(panel3d);

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function draw3D(data) {
    ctx.clearRect(0, 0, W, H);

    ctx.fillStyle = 'rgba(5, 15, 40, 0.95)';
    roundRect(0, 0, W, H, 18);
    ctx.fill();

    ctx.strokeStyle = data.color || '#00ccff';
    ctx.lineWidth = 3;
    roundRect(2, 2, W - 4, H - 4, 16);
    ctx.stroke();

    ctx.fillStyle = data.color || '#00ccff';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(data.name, W / 2, 54);

    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.moveTo(30, 70);
    ctx.lineTo(W - 30, 70);
    ctx.stroke();
    ctx.globalAlpha = 1;

    ctx.fillStyle = '#cce4ff';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    (data.facts || []).forEach((f, i) => {
      ctx.fillText('• ' + f, 28, 104 + i * 30);
    });

    ctx.fillStyle = 'rgba(150,180,220,0.45)';
    ctx.font = '14px Arial';
    ctx.textAlign = 'right';
    ctx.fillText('Gâchette pour fermer', W - 16, H - 10);

    texture.needsUpdate = true;
  }

  let trackedMesh = null;
  const _wp = new THREE.Vector3();

  return {
    panel: panel3d,
    show(data, mesh) {
      trackedMesh = mesh;
      if (renderer.xr.isPresenting) {
        draw3D(data);
        panel3d.visible = true;
        el.style.display = 'none';
      } else {
        showHTML(data);
        panel3d.visible = false;
      }
    },
    hide() {
      el.style.display = 'none';
      panel3d.visible = false;
      trackedMesh = null;
    },
    update(camera) {
      if (!trackedMesh || !panel3d.visible) return;
      trackedMesh.getWorldPosition(_wp);
      const radius = trackedMesh.userData.radius || 10;
      panel3d.position.set(
        _wp.x + radius + PANEL_W / 2 + 5,
        _wp.y + radius * 0.5,
        _wp.z
      );
      panel3d.lookAt(camera.position);
    }
  };
}
