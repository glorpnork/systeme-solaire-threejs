import * as THREE from 'three';

const textureLoader = new THREE.TextureLoader();

export function createPlanet(scene, data) {
  // 1. Création du pivot de révolution (conserve ton système d'orbite d'origine)
  const pivot = new THREE.Object3D();
  scene.add(pivot);

  // 2. Chargement de la texture de surface
  const texture = textureLoader.load(data.texture);
  texture.colorSpace = THREE.SRGBColorSpace;
  
  // Amélioration du filtrage pour éviter le flou à distance
  texture.minFilter = THREE.LinearMipmapLinearFilter;

  // 3. Utilisation de MeshStandardMaterial (réaliste, réagit aux lumières)
  const material = new THREE.MeshStandardMaterial({ 
    map: texture,
    roughness: 0.8,
    metalness: 0.1
  });
  
  const geometry = new THREE.SphereGeometry(data.size, 64, 64); // 64 segments pour éliminer les facettes
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = data.distance;
  mesh.name = data.name;
  
  // Conserve tes données indispensables pour les infoPanels VR et interactions
  mesh.userData = { info: data.info };
  pivot.add(mesh);

  // 4. Gestion optionnelle de l'atmosphère (Ex: Vénus)
  if (data.atmosphereTexture) {
    const atmosTexture = textureLoader.load(data.atmosphereTexture);
    const atmosMaterial = new THREE.MeshStandardMaterial({
      map: atmosTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.45
    });
    
    const atmosGeometry = new THREE.SphereGeometry(data.size * 1.01, 64, 64);
    const atmosMesh = new THREE.Mesh(atmosGeometry, atmosMaterial);
    mesh.add(atmosMesh); // L'atmosphère tourne avec la planète
  }

  // 5. Gestion optionnelle des anneaux (Ex: Saturne)
  if (data.ringTexture) {
    const ringTexture = textureLoader.load(data.ringTexture);
    const innerRadius = data.size * 1.4;
    const outerRadius = data.size * 2.3;
    const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 64);

    // Ajustement des coordonnées UV pour enrouler proprement la texture sur l'anneau horizontal
    const pos = ringGeometry.attributes.position;
    const v3 = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v3.fromBufferAttribute(pos, i);
      ringGeometry.attributes.uv.setXY(i, v3.length() < (innerRadius + outerRadius) / 2 ? 0 : 1, 1);
    }

    const ringMaterial = new THREE.MeshStandardMaterial({
      map: ringTexture,
      alphaMap: ringTexture, // Utilisation de la carte alpha pour la transparence fine
      side: THREE.DoubleSide,
      transparent: true,
      roughness: 0.6
    });

    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    ringMesh.rotation.x = Math.PI / 2;
    mesh.add(ringMesh);
  }

  return { pivot, mesh, speed: data.speed };
}