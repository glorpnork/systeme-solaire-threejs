
import * as THREE from 'three';

export function createMars(scene, textures, planetOrbits) {
  const orbit = new THREE.Group();
  scene.add(orbit);

  planetOrbits.push({
    orbit,
    speed: 0.0016
  });

  const geometry = new THREE.SphereGeometry(5, 64, 64);
  const material = new THREE.MeshStandardMaterial({
    map: textures.mars
  });

  const planet = new THREE.Mesh(geometry, material);
  planet.position.x = 110;
  planet.userData.name = 'mars';
  planet.userData.radius = 5;

  orbit.add(planet);
  return planet;
}