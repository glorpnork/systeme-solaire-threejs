import * as THREE from 'three';

export function createInfoPanel(scene, renderer) {
  const CW = 1024, CH = 900;
  const cv = document.createElement('canvas');
  cv.width = CW; cv.height = CH;
  const ctx = cv.getContext('2d');
  const texture = new THREE.CanvasTexture(cv);

  const panel = new THREE.Mesh(
    new THREE.PlaneGeometry(1, CH / CW),
    new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
  );
  panel.renderOrder = 999;
  panel.visible = false;
  scene.add(panel);

  let currentMesh = null;

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

  function wrapText(text, maxWidth, font) {
    ctx.font = font;
    const words = text.split(' ');
    const result = [];
    let current = '';
    for (const word of words) {
      const test = current ? current + ' ' + word : word;
      if (ctx.measureText(test).width > maxWidth && current) {
        result.push(current);
        current = word;
      } else {
        current = test;
      }
    }
    if (current) result.push(current);
    return result;
  }

  function drawPanel(data) {
    ctx.clearRect(0, 0, CW, CH);

    // Fond sombre
    ctx.fillStyle = 'rgba(3, 10, 32, 0.96)';
    roundRect(6, 6, CW - 12, CH - 12, 28);
    ctx.fill();

    // Halo extérieur
    ctx.strokeStyle = 'rgba(0, 200, 255, 0.18)';
    ctx.lineWidth = 20;
    roundRect(6, 6, CW - 12, CH - 12, 28);
    ctx.stroke();

    // Bordure cyan nette
    ctx.strokeStyle = '#00ccff';
    ctx.lineWidth = 4;
    roundRect(6, 6, CW - 12, CH - 12, 28);
    ctx.stroke();

    // Titre
    ctx.fillStyle = '#00d4ff';
    ctx.font = 'bold 80px Arial';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0, 200, 255, 0.6)';
    ctx.shadowBlur = 24;
    ctx.fillText(data.title, CW / 2, 108);
    ctx.shadowBlur = 0;

    // Séparateur
    ctx.strokeStyle = 'rgba(0, 200, 255, 0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(48, 140);
    ctx.lineTo(CW - 48, 140);
    ctx.stroke();

    // Faits
    const lines = (data.text || '').split('\n').filter(Boolean);
    ctx.fillStyle = '#c8dff5';
    ctx.font = '40px Arial';
    ctx.textAlign = 'left';
    const factLineH = 68;
    lines.forEach((line, i) => {
      ctx.fillText('• ' + line, 52, 208 + i * factLineH);
    });

    const factsBottom = 208 + lines.length * factLineH + 20;

    // Séparateur audioText
    ctx.strokeStyle = 'rgba(0, 200, 255, 0.25)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(48, factsBottom);
    ctx.lineTo(CW - 48, factsBottom);
    ctx.stroke();

    // audioText
    if (data.audioText) {
      const audioFont = 'italic 32px Arial';
      const wrappedAudio = wrapText(data.audioText, CW - 104, audioFont);
      ctx.font = audioFont;
      ctx.fillStyle = 'rgba(180, 210, 240, 0.82)';
      ctx.textAlign = 'left';
      wrappedAudio.forEach((line, i) => {
        ctx.fillText(line, 52, factsBottom + 44 + i * 44);
      });
    }

    texture.needsUpdate = true;
  }

  const _wp = new THREE.Vector3();
  const _right = new THREE.Vector3();
  const _camWorld = new THREE.Vector3();
  const _camQuat = new THREE.Quaternion();

  return {
    show: (data, mesh) => {
      currentMesh = mesh;
      drawPanel(data);
      panel.visible = true;
    },
    hide: () => {
      panel.visible = false;
      currentMesh = null;
    },
    update: (camera) => {
      if (!panel.visible || !currentMesh) return;

      currentMesh.getWorldPosition(_wp);
      camera.getWorldPosition(_camWorld);
      camera.getWorldQuaternion(_camQuat);

      const radius = currentMesh.userData.radius || 3;
      const pw = radius * 2 + 4;

      _right.set(1, 0, 0).applyQuaternion(_camQuat);

      panel.position.copy(_wp).addScaledVector(_right, radius * 1.5 + pw * 0.55);
      panel.scale.setScalar(pw);
      panel.lookAt(_camWorld);
    }
  };
}
