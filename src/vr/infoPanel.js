import * as THREE from 'three';

export function createInfoPanel(scene, renderer) {
  // Création d'un élément d'affichage 2D superposé pour le mode écran classique
  const overlay = document.createElement('div');
  overlay.id = 'planet-info-overlay';
  overlay.style.position = 'absolute';
  overlay.style.top = '20px';
  overlay.style.right = '20px';
  overlay.style.backgroundColor = 'rgba(5, 15, 40, 0.85)';
  overlay.style.color = '#ffffff';
  overlay.style.padding = '20px';
  overlay.style.borderRadius = '8px';
  overlay.style.border = '1px solid #00ccff';
  overlay.style.fontFamily = 'Arial, sans-serif';
  overlay.style.width = '300px';
  overlay.style.display = 'none';
  overlay.style.pointerEvents = 'none';
  document.body.appendChild(overlay);

  return {
    show: (data, mesh) => {
      overlay.innerHTML = `<h2 style="margin-top:0;color:#00ccff;">${data.title}</h2><p style="white-space:pre-line;line-height:1.4;">${data.text}</p>`;
      overlay.style.display = 'block';
    },
    hide: () => {
      overlay.style.display = 'none';
    },
    update: (camera) => {
      // Utilisé pour orienter un panneau en VR si nécessaire
    }
  };
}