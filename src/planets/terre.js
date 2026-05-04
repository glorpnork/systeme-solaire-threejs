
import * as THREE from 'three';

export function createEarth(scene, textures, planetOrbits) {
  const orbit = new THREE.Group();
  scene.add(orbit);

  planetOrbits.push({
    orbit,
    speed: 0.002
  });

  const geometry = new THREE.SphereGeometry(6, 64, 64);
  const material = new THREE.MeshStandardMaterial({
    map: textures.earth
  });

  const planet = new THREE.Mesh(geometry, material);
  planet.position.x = 85;

  orbit.add(planet);
}