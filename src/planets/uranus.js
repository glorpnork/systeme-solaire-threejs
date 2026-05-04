
import * as THREE from 'three';

export function createUranus(scene, textures, planetOrbits) {
  const orbit = new THREE.Group();
  scene.add(orbit);

  planetOrbits.push({
    orbit,
    speed: 0.0005
  });

  const geometry = new THREE.SphereGeometry(9, 64, 64);
  const material = new THREE.MeshStandardMaterial({
    map: textures.uranus
  });

  const planet = new THREE.Mesh(geometry, material);
  planet.position.x = 250;

  orbit.add(planet);
}