import * as THREE from 'three';
import { createSoleil } from './planets/soleil.js';
import { createPlanet } from './planets/planetFactory.js';
import { initControls } from './utils/controls.js';
import { setupVRInteraction } from './vr/interaction.js';
import { planetsData } from './data/planetData.js';

// Configuration Scène, Caméra et Rendu
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;
renderer.outputColorSpace = THREE.SRGBColorSpace; // Rendu sRGB obligatoire pour les textures 2K
document.body.appendChild(renderer.domElement);

// Faible lumière ambiante pour déboucher les ombres à l'arrière des planètes
const ambientLight = new THREE.AmbientLight(0x222222);
scene.add(ambientLight);

// Chargement de l'environnement d'étoiles HD en arrière-plan
const textureLoader = new THREE.TextureLoader();
const spaceTexture = textureLoader.load('textures/2k_stars_milky_way.jpg');
scene.background = spaceTexture;

// Initialisation des contrôles caméra
const controls = initControls(camera, renderer);
camera.position.set(0, 50, 150);
controls.update();

// Création du Soleil
const soleil = createSoleil(scene);

// COMPILATION : Une seule ligne génère TOUTES les planètes dynamiquement !
const planeteObjects = planetsData.map(data => createPlanet(scene, data));

// Regroupement de tous les meshes pour le Raycaster (Clic souris + Laser VR)
const interactiveMeshes = [soleil, ...planeteObjects.map(p => p.mesh)];
setupVRInteraction(scene, renderer, camera, interactiveMeshes);

// Boucle d'animation principale (Fonctionnalités conservées à 100%)
renderer.setAnimationLoop(() => {
  // Rotation du Soleil sur lui-même
  soleil.rotation.y += 0.002;

  // Animation globale de toutes les planètes de la liste
  planeteObjects.forEach(planete => {
    planete.pivot.rotation.y += planete.speed; // Révolution autour du Soleil
    planete.mesh.rotation.y += 0.01;           // Rotation sur elle-même
  });

  controls.update();
  renderer.render(scene, camera);
});

// Gestion du redimensionnement de la fenêtre
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});