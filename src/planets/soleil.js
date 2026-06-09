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

  // CORRIGÉ : Intensité réduite de 50 à 8 pour éviter de brûler les textures
  // La distance passe à 2000 et le decay (atténuation) descend à 0 pour éclairer uniformément
  const sunLight = new THREE.PointLight(0xffffff, 8, 2000, 0.0);
  scene.add(sunLight);

  return soleilMesh;
}