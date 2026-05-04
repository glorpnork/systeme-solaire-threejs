import * as THREE from 'three';

export function createSun(scene, textures) {
  const geometry = new THREE.SphereGeometry(
    20,
    64,
    64
  );

  const material = new THREE.MeshBasicMaterial({
    map: textures.sun,
  
  });

  const sun = new THREE.Mesh(
    geometry,
    material
  );

  scene.add(sun);
}