
import * as THREE from 'three';

export function createJupiter(scene, textures, planetOrbits) {
  const orbit = new THREE.Group();
  scene.add(orbit);

  planetOrbits.push({
    orbit,
    speed: 0.001
  });

  const geometry = new THREE.SphereGeometry(13, 64, 64);
  const material = new THREE.MeshStandardMaterial({
    map: textures.jupiter
  });

  const planet = new THREE.Mesh(geometry, material);
  planet.position.x = 150;
  planet.userData.name = 'jupiter';
  planet.userData.radius = 13;

  orbit.add(planet);
  return planet;
}