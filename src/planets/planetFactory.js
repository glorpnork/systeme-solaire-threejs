import * as THREE from 'three';

const textureLoader = new THREE.TextureLoader();

export function createPlanet(scene, data) {
  const pivot = new THREE.Object3D();
  scene.add(pivot);

  const texture = textureLoader.load(data.texture);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;

  const material = new THREE.MeshStandardMaterial({ 
    map: texture,
    roughness: 0.8,
    metalness: 0.1
  });
  
  const geometry = new THREE.SphereGeometry(data.size, 64, 64);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = data.distance;
  mesh.name = data.name;
  
  // Configuration indispensable pour le repérage par clic/laser dans interaction.js
  mesh.userData = { 
    name: data.name,
    radius: data.size,
    info: data.info 
  };
  
  pivot.add(mesh);

  // Atmosphère optionnelle (ex: Vénus)
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
    mesh.add(atmosMesh);
  }

  // Anneaux optionnels (ex: Saturne)
  if (data.ringTexture) {
    const ringTexture = textureLoader.load(data.ringTexture);
    const innerRadius = data.size * 1.4;
    const outerRadius = data.size * 2.3;
    const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 64);

    const pos = ringGeometry.attributes.position;
    const v3 = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v3.fromBufferAttribute(pos, i);
      ringGeometry.attributes.uv.setXY(i, v3.length() < (innerRadius + outerRadius) / 2 ? 0 : 1, 1);
    }

    // CORRIGÉ : alphaMap retiré car ringTexture (PNG) porte déjà sa propre couche alpha
    const ringMaterial = new THREE.MeshStandardMaterial({
      map: ringTexture,
      side: THREE.DoubleSide,
      transparent: true,
      roughness: 0.6
    });

    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    ringMesh.rotation.x = Math.PI / 2;
    mesh.add(ringMesh);
  }

  // Lunes
  const moons = [];
  if (data.moons) {
    for (const moonData of data.moons) {
      const moonPivot = new THREE.Object3D();
      moonPivot.rotation.z = moonData.tilt ?? 0;
      mesh.add(moonPivot);

      let moonMat;
      if (moonData.texture) {
        const moonTex = textureLoader.load(moonData.texture);
        moonTex.colorSpace = THREE.SRGBColorSpace;
        moonMat = new THREE.MeshStandardMaterial({ map: moonTex, roughness: 0.9, metalness: 0.0 });
      } else {
        moonMat = new THREE.MeshStandardMaterial({ color: moonData.color ?? 0xaaaaaa, roughness: 0.9, metalness: 0.0 });
      }

      const moonMesh = new THREE.Mesh(new THREE.SphereGeometry(moonData.radius, 32, 32), moonMat);
      moonMesh.position.x = moonData.distance;
      moonMesh.name = moonData.name;
      moonMesh.userData = { name: moonData.name, radius: moonData.radius };
      moonPivot.add(moonMesh);

      moons.push({ pivot: moonPivot, speed: moonData.speed });
    }
  }

  return { pivot, mesh, speed: data.speed, moons };
}