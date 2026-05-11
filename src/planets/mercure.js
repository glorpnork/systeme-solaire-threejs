import * as THREE from 'three';

export function createMercury(scene, textures, planetOrbits) {
  const orbit = new THREE.Group();
  scene.add(orbit);

  planetOrbits.push({
    orbit,
    speed: 0.004
  });

  const geometry = new THREE.SphereGeometry(3, 64, 64);

  const material = new THREE.MeshStandardMaterial({
    map: textures.mercury
  });

  const planet = new THREE.Mesh(
    geometry,
    material
  );

  planet.position.x = 40;
  planet.userData.name = 'mercure';
  planet.userData.radius = 3;

  orbit.add(planet);
  return planet;
}