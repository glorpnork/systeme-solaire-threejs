
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
import { setupInteraction } from './vr/interaction.js';

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

const cameraRig = new THREE.Group();
cameraRig.add(camera);
scene.add(cameraRig);

// Textures

const textureLoader = new THREE.TextureLoader();

const textures = {
  background: textureLoader.load('/textures/2k_stars_milky_way.jpg'),

  sun: textureLoader.load('/textures/8k_sun.jpg'),
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
  20000,
  8000
);

sunLight.position.set(0, 0, 0);
scene.add(sunLight);

// Ambient light pour éviter que le dos des planètes soit sombre
const ambientLight = new THREE.AmbientLight(0xf4F5D2, 0.35);
scene.add(ambientLight);

// Planètes — on collecte les meshes pour l'interaction

const planetOrbits = [];
const planetMeshes = [];

const sun = createSun(scene, textures);
planetMeshes.push(sun);

planetMeshes.push(createMercury(scene, textures, planetOrbits));
planetMeshes.push(createVenus(scene, textures, planetOrbits));
planetMeshes.push(createEarth(scene, textures, planetOrbits));
planetMeshes.push(createMars(scene, textures, planetOrbits));
planetMeshes.push(createJupiter(scene, textures, planetOrbits));
planetMeshes.push(createSaturn(scene, textures, planetOrbits));
planetMeshes.push(createUranus(scene, textures, planetOrbits));
planetMeshes.push(createNeptune(scene, textures, planetOrbits));

// Contrôles

const { controls } = setupControls(camera, renderer);

// En mode VR : désactiver OrbitControls (il interfère avec les manettes)
// et placer la caméra à une bonne distance pour voir le système
renderer.xr.addEventListener('sessionstart', () => {
  controls.enabled = false;
  // Positionner le rig pour que l'utilisateur démarre avec une bonne vue
  cameraRig.position.set(0, 150, 500);
  cameraRig.quaternion.identity();
});

renderer.xr.addEventListener('sessionend', () => {
  controls.enabled = true;
  // Restaurer la caméra desktop et réinitialiser le rig
  camera.position.set(0, 150, 500);
  cameraRig.position.set(0, 0, 0);
  cameraRig.quaternion.identity();
  controls.target.set(0, 0, 0);
  controls.update();
});

// État de vitesse partagé entre le slider HTML et les manettes VR
const speedState = { multiplier: 1 };

// Interaction (clic, zoom, panneau, audio, manettes VR)

const interaction = setupInteraction(renderer, scene, camera, cameraRig, planetMeshes, controls, speedState);

// Curseur de vitesse
let simTime = 0;
let lastTime = null;

const slider = document.getElementById('speed-slider');
const speedLabel = document.getElementById('speed-value');

function updateSpeedDisplay(v) {
  slider.value = v;
  speedLabel.textContent = v === 0 ? 'Pause' : `×${v.toFixed(1)}`;
}

slider.addEventListener('input', () => {
  speedState.multiplier = parseFloat(slider.value);
  updateSpeedDisplay(speedState.multiplier);
  interaction.notifySpeedChange(speedState.multiplier);
});

// Animation

let lastDisplayedSpeed = 1;

function animate(realTime) {
  if (lastTime !== null) {
    simTime += (realTime - lastTime) * speedState.multiplier;
  }
  lastTime = realTime;

  // Synchroniser le slider si la vitesse a été changée en VR
  if (speedState.multiplier !== lastDisplayedSpeed) {
    updateSpeedDisplay(speedState.multiplier);
    lastDisplayedSpeed = speedState.multiplier;
  }

  planetOrbits.forEach(({ orbit, speed }) => {
    orbit.rotation.y = simTime * speed;
  });

  // Rotation du soleil
  sun.rotation.y = simTime * 0.0005;

  interaction.update();

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

// Taille

window.addEventListener('resize', () => {
  camera.aspect =
    window.innerWidth / window.innerHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );
});
