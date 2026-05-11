
import * as THREE from 'three';

export function createNeptune(scene, textures, planetOrbits) {
  const orbit = new THREE.Group();
  scene.add(orbit);

  planetOrbits.push({
    orbit,
    speed: 0.0003
  });

  const geometry = new THREE.SphereGeometry(9, 64, 64);
  const material = new THREE.MeshStandardMaterial({
    map: textures.neptune
  });

  const planet = new THREE.Mesh(geometry, material);
  planet.position.x = 300;
  planet.userData.name = 'neptune';
  planet.userData.radius = 9;

  orbit.add(planet);
  return planet;
}