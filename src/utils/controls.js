// utils/controls.js

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function setupControls(camera, renderer) {
  

  const controls = new OrbitControls(
    camera,
    renderer.domElement
  );

  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  controls.enableZoom = true;
  controls.zoomSpeed = 1.2;

  controls.enableRotate = true;
  controls.rotateSpeed = 0.8;

  controls.enablePan = false;

  controls.minDistance = 30;
  controls.maxDistance = 5000;

  controls.target = new THREE.Vector3(0, 0, 0);

  

  const keys = {};

  window.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
  });

  window.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
  });

  function updateKeyboardMovement() {
    const speed = 4;

    if (keys['z']) {
      camera.position.z -= speed;
      controls.target.z -= speed;
    }

    if (keys['s']) {
      camera.position.z += speed;
      controls.target.z += speed;
    }

    if (keys['q']) {
      camera.position.x -= speed;
      controls.target.x -= speed;
    }

    if (keys['d']) {
      camera.position.x += speed;
      controls.target.x += speed;
    }

    if (keys[' ']) {
      camera.position.y += speed;
      controls.target.y += speed;
    }

    if (keys['shift']) {
      camera.position.y -= speed;
      controls.target.y -= speed;
    }
  }



  function animateControls() {
    updateKeyboardMovement();
    controls.update();

    requestAnimationFrame(animateControls);
  }

  animateControls();

  return { controls };
}