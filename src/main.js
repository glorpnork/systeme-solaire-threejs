
import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { createSun } from './planets/soleil.js';
import { createMercury } from './planets/mercure.js';
import { createVenus } from './planets/venus.js';
import { createEarth } from './planets/terre.js';
import { createMars } from './planets/mars.js';
import { createJupiter } from './planets/jupiter.js';
import { createSaturn } from './planets/saturne.js';
import { createUranus } from './planets/uranus.js';
import { createNeptune } from './planets/neptune.js';

import { setupControls } from './utils/controls.js';

const canvas = document.getElementById('three-canvas');

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Activation VR
renderer.xr.enabled = true;


document.body.appendChild(VRButton.createButton(renderer));

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  8000
);

camera.position.set(0, 150, 500);

//Textures

const textureLoader = new THREE.TextureLoader();

const textures = {
  background: textureLoader.load('/textures/2k_stars_milky_way.jpg'),

  sun: textureLoader.load('/textures/2k_sun.jpg'),
  mercury: textureLoader.load('/textures/2k_mercury.jpg'),
  venus: textureLoader.load('/textures/2k_venus_surface.jpg'),
  earth: textureLoader.load('/textures/2k_earth_daymap.jpg'),
  mars: textureLoader.load('/textures/2k_mars.jpg'),
  jupiter: textureLoader.load('/textures/2k_jupiter.jpg'),
  saturn: textureLoader.load('/textures/2k_saturn.jpg'),
  uranus: textureLoader.load('/textures/2k_uranus.jpg'),
  neptune: textureLoader.load('/textures/2k_neptune.jpg')
};

scene.background = textures.background;





// LUMIÈRE DU SOLEIL 

const sunLight = new THREE.PointLight(
  0xf4F5D2,
  15000,   
  8000   
);

sunLight.position.set(0, 0, 0);
scene.add(sunLight);





//Planètes

const planetOrbits = [];

createSun(scene, textures);
createMercury(scene, textures, planetOrbits);
createVenus(scene, textures, planetOrbits);
createEarth(scene, textures, planetOrbits);
createMars(scene, textures, planetOrbits);
createJupiter(scene, textures, planetOrbits);
createSaturn(scene, textures, planetOrbits);
createUranus(scene, textures, planetOrbits);
createNeptune(scene, textures, planetOrbits);

// Contrôles

setupControls(camera, renderer);

// Animation

function animate(time) {
  planetOrbits.forEach(({ orbit, speed }) => {
    orbit.rotation.y = time * speed;
  });

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);



//taille

window.addEventListener('resize', () => {
  camera.aspect =
    window.innerWidth / window.innerHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );
});