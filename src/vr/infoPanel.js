import * as THREE from 'three';

export function createInfoPanel(scene, renderer) {
  const CW = 512, CH = 450;
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
    roundRect(3, 3, CW - 6, CH - 6, 14);
    ctx.fill();

    // Halo extérieur
    ctx.strokeStyle = 'rgba(0, 200, 255, 0.18)';
    ctx.lineWidth = 10;
    roundRect(3, 3, CW - 6, CH - 6, 14);
    ctx.stroke();

    // Bordure cyan nette
    ctx.strokeStyle = '#00ccff';
    ctx.lineWidth = 2;
    roundRect(3, 3, CW - 6, CH - 6, 14);
    ctx.stroke();

    // Titre
    ctx.fillStyle = '#00d4ff';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0, 200, 255, 0.6)';
    ctx.shadowBlur = 12;
    ctx.fillText(data.title, CW / 2, 54);
    ctx.shadowBlur = 0;

    // Séparateur
    ctx.strokeStyle = 'rgba(0, 200, 255, 0.35)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(24, 70);
    ctx.lineTo(CW - 24, 70);
    ctx.stroke();

    // Faits
    const lines = (data.text || '').split('\n').filter(Boolean);
    ctx.fillStyle = '#c8dff5';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    const factLineH = 34;
    lines.forEach((line, i) => {
      ctx.fillText('• ' + line, 26, 104 + i * factLineH);
    });

    const factsBottom = 104 + lines.length * factLineH + 10;

    // Séparateur audioText
    ctx.strokeStyle = 'rgba(0, 200, 255, 0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(24, factsBottom);
    ctx.lineTo(CW - 24, factsBottom);
    ctx.stroke();

    // audioText
    if (data.audioText) {
      const audioFont = 'italic 16px Arial';
      const wrappedAudio = wrapText(data.audioText, CW - 52, audioFont);
      ctx.font = audioFont;
      ctx.fillStyle = 'rgba(180, 210, 240, 0.82)';
      ctx.textAlign = 'left';
      wrappedAudio.forEach((line, i) => {
        ctx.fillText(line, 26, factsBottom + 22 + i * 22);
      });
    }

    texture.needsUpdate = true;
  }

  const _wp = new THREE.Vector3();
  const _right = new THREE.Vector3();

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
      const radius = currentMesh.userData.radius || 3;

      // Taille du panneau proportionnelle à la distance de zoom
      const pw = radius * 2 + 4;

      // Axe droit de la caméra pour positionner le panneau à côté
      _right.set(1, 0, 0).applyQuaternion(camera.quaternion);

      panel.position.copy(_wp).addScaledVector(_right, radius * 1.5 + pw * 0.55);
      panel.scale.setScalar(pw);
      panel.lookAt(camera.position);
    }
  };
}
