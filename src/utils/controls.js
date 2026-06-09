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

  const _fwd = new THREE.Vector3();
  const _right = new THREE.Vector3();

  function updateKeyboardMovement() {
    const speed = 4;

    // Vecteur "avant" : direction du regard projeté dans le plan horizontal
    camera.getWorldDirection(_fwd);
    _fwd.y = 0;
    if (_fwd.lengthSq() > 0.001) _fwd.normalize();

    // Vecteur "droite" : axe X local de la caméra projeté dans le plan horizontal
    _right.set(1, 0, 0).applyQuaternion(camera.quaternion);
    _right.y = 0;
    if (_right.lengthSq() > 0.001) _right.normalize();

    if (keys['z'] || keys['arrowup']) {
      camera.position.addScaledVector(_fwd, speed);
      controls.target.addScaledVector(_fwd, speed);
    }

    if (keys['s'] || keys['arrowdown']) {
      camera.position.addScaledVector(_fwd, -speed);
      controls.target.addScaledVector(_fwd, -speed);
    }

    if (keys['q'] || keys['arrowleft']) {
      camera.position.addScaledVector(_right, -speed);
      controls.target.addScaledVector(_right, -speed);
    }

    if (keys['d'] || keys['arrowright']) {
      camera.position.addScaledVector(_right, speed);
      controls.target.addScaledVector(_right, speed);
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