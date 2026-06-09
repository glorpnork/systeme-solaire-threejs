import * as THREE from 'three';
import { createSoleil } from './planets/soleil.js';
import { createPlanet } from './planets/planetFactory.js';
import { setupControls } from './utils/controls.js';
import { setupInteraction } from './vr/interaction.js';
import { planetsData } from './data/planetData.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;
renderer.outputColorSpace = THREE.SRGBColorSpace; 
document.body.appendChild(renderer.domElement);

const cameraRig = new THREE.Group();
cameraRig.add(camera);
scene.add(cameraRig);

// Légère augmentation de la lumière ambiante pour mieux voir le dos des planètes
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const textureLoader = new THREE.TextureLoader();
const spaceTexture = textureLoader.load('textures/2k_stars_milky_way.jpg');
scene.background = spaceTexture;

const controlsObj = setupControls(camera, renderer);
const controls = controlsObj.controls;
camera.position.set(0, 80, 220); // Recul de la caméra pour une meilleure vue d'ensemble au démarrage
controls.update();

const speedState = { multiplier: 1.0 };

const speedSlider = document.getElementById('speed-slider');
const speedValue = document.getElementById('speed-value');
if (speedSlider && speedValue) {
  speedSlider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    speedState.multiplier = val;
    speedValue.textContent = `×${val.toFixed(1)}`;
    if (interaction) interaction.notifySpeedChange(val);
  });
}

const soleil = createSoleil(scene);
const planeteObjects = planetsData.map(data => createPlanet(scene, data));

const interactiveMeshes = [soleil, ...planeteObjects.map(p => p.mesh)];

const interaction = setupInteraction(renderer, scene, camera, cameraRig, interactiveMeshes, controls, speedState);

renderer.setAnimationLoop(() => {
  const currentSpeedMultiplier = speedState.multiplier;

  soleil.rotation.y += 0.002 * currentSpeedMultiplier;

  planeteObjects.forEach(planete => {
    planete.pivot.rotation.y += planete.speed * currentSpeedMultiplier;
    planete.mesh.rotation.y += 0.01 * currentSpeedMultiplier;
  });

  if (interaction) {
    interaction.update();
  }

  renderer.render(scene, camera);
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});