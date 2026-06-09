import * as THREE from 'three';

export function createSoleil(scene) {
  const textureLoader = new THREE.TextureLoader();
  const soleilTexture = textureLoader.load('textures/8k_sun.jpg');
  soleilTexture.colorSpace = THREE.SRGBColorSpace;

  const geometry = new THREE.SphereGeometry(16, 64, 64);
  const material = new THREE.MeshBasicMaterial({ map: soleilTexture });
  const soleilMesh = new THREE.Mesh(geometry, material);
  
  soleilMesh.name = "Soleil";
  soleilMesh.userData = {
    name: "Soleil",
    radius: 16
  };
  
  scene.add(soleilMesh);

  // CORRECTION : Intensité abaissée à 8 et decay à 0 pour éclairer au loin uniformément sans éblouir
  const sunLight = new THREE.PointLight(0xffffff, 8, 2000, 0.0);
  scene.add(sunLight);

  return soleilMesh;
}