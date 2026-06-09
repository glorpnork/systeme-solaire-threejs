import * as THREE from 'three';

export function createSoleil(scene) {
  const textureLoader = new THREE.TextureLoader();
  const soleilTexture = textureLoader.load('textures/8k_sun.jpg');
  soleilTexture.colorSpace = THREE.SRGBColorSpace;

  // Augmentation des segments (64, 64) pour une sphère parfaitement lisse
  const geometry = new THREE.SphereGeometry(16, 64, 64);
  const material = new THREE.MeshBasicMaterial({ map: soleilTexture });
  const soleilMesh = new THREE.Mesh(geometry, material);
  
  soleilMesh.name = "Soleil";
  soleilMesh.userData = {
    info: "Le Soleil est l'étoile centrale de notre système solaire, représentant 99,8% de sa masse totale."
  };
  
  scene.add(soleilMesh);

  // Source de lumière au centre du soleil pour éclairer les surfaces des planètes
  const sunLight = new THREE.PointLight(0xffffff, 3, 500, 0.5);
  scene.add(sunLight);

  return soleilMesh;
}