import * as THREE from 'three';

export function createSaturn(scene, textures, planetOrbits) {
  const orbit = new THREE.Group();
  scene.add(orbit);

  planetOrbits.push({
    orbit,
    speed: 0.0008
  });

  const geometry = new THREE.SphereGeometry(11, 64, 64);

  const material = new THREE.MeshStandardMaterial({
    map: textures.saturn
  });

  const planet = new THREE.Mesh(
    geometry,
    material
  );

  planet.position.x = 200;
  orbit.add(planet);

  const ringGeometry = new THREE.RingGeometry(
    14,
    19,
    64
  );

  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0xd8c28a,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.8
  });

  const ring = new THREE.Mesh(
    ringGeometry,
    ringMaterial
  );

  ring.rotation.x = Math.PI / 2;
  planet.add(ring);
}