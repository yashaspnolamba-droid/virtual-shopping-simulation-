/**
 * First Person Controller - Rebuilt for 100% Stability & Zero Glitches
 * Smooth WASD walking, gentle boundary constraints, reliable pointer lock, and crosshair interaction.
 */

import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { sound } from '../utils/audio.js';

export class FirstPersonController {
  constructor(camera, domElement, interactables, onInspectCallback) {
    this.camera = camera;
    this.domElement = domElement;
    this.interactables = interactables;
    this.onInspect = onInspectCallback;

    this.controls = new PointerLockControls(camera, domElement);

    // Movement state
    this.moveState = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      sprint: false
    };

    this.velocity = new THREE.Vector3();
    this.direction = new THREE.Vector3();

    this.baseSpeed = 4.8;
    this.sprintSpeed = 7.5;
    this.damping = 12.0;

    // Head bobbing & eye height
    this.bobTimer = 0;
    this.defaultEyeHeight = 1.65;
    this.camera.position.set(0, this.defaultEyeHeight, 8.5);

    // Raycaster for looking at products
    this.raycaster = new THREE.Raycaster();
    this.centerScreen = new THREE.Vector2(0, 0);
    this.hoveredProduct = null;
    this.lastHoveredId = null;

    // Plinth obstacle positions for soft collision avoidance
    this.plinthPositions = [
      { x: -4.5, z: -5.5 },
      { x: -4.5, z: -1.5 },
      { x: -4.5, z: 2.5 },
      { x: 4.5, z: -5.5 },
      { x: 4.5, z: -1.5 },
      { x: 4.5, z: 2.5 },
      { x: 0, z: -1.5 } // Center bench
    ];

    // Room boundaries (inside store)
    this.bounds = {
      minX: -9.5,
      maxX: 9.5,
      minZ: -11.5,
      maxZ: 10.5
    };

    this.externalModalOpen = false;

    this.initEvents();
  }

  initEvents() {
    // 1. Pointer Lock State Listeners
    this.controls.addEventListener('lock', () => {
      this.resetMovement();
      this.updatePauseOverlay(false);
    });

    this.controls.addEventListener('unlock', () => {
      this.resetMovement();
      // Show resume overlay only if no product modal or cart is open
      if (!this.externalModalOpen) {
        this.updatePauseOverlay(true);
      }
    });

    // 2. Click to Resume Roaming (if pointer dropped without a modal)
    this.domElement.addEventListener('click', (e) => {
      if (!this.controls.isLocked && !this.externalModalOpen) {
        this.lock();
      }
    });

    // Pause banner click to lock
    const pauseBanner = document.getElementById('pause-overlay');
    if (pauseBanner) {
      pauseBanner.addEventListener('click', () => {
        if (!this.externalModalOpen) {
          this.lock();
        }
      });
    }

    // 3. Keyboard Inputs
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      // Inspect hotkey E
      if (e.code === 'KeyE') {
        if (this.controls.isLocked && this.hoveredProduct) {
          this.triggerInspect(this.hoveredProduct);
        }
        return;
      }

      if (!this.controls.isLocked) return;

      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          this.moveState.forward = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          this.moveState.backward = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          this.moveState.left = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          this.moveState.right = true;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          this.moveState.sprint = true;
          break;
      }
    });

    window.addEventListener('keyup', (e) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          this.moveState.forward = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          this.moveState.backward = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          this.moveState.left = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          this.moveState.right = false;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          this.moveState.sprint = false;
          break;
      }
    });

    // 4. Click while roaming: inspect item if hovered
    window.addEventListener('click', (e) => {
      // Don't trigger if clicked on UI
      if (e.target.closest('#product-modal') || e.target.closest('#cart-drawer') || e.target.closest('#hud-top')) {
        return;
      }

      if (this.controls.isLocked && this.hoveredProduct) {
        this.triggerInspect(this.hoveredProduct);
      }
    });

    // 5. Window Blur / Tab switch - safely reset movement so keys don't stick
    window.addEventListener('blur', () => {
      this.resetMovement();
    });
  }

  resetMovement() {
    this.moveState.forward = false;
    this.moveState.backward = false;
    this.moveState.left = false;
    this.moveState.right = false;
    this.moveState.sprint = false;
    this.velocity.set(0, 0, 0);
  }

  setModalOpen(isOpen) {
    this.externalModalOpen = isOpen;
    if (isOpen) {
      this.updatePauseOverlay(false);
      this.unlock();
    }
  }

  updatePauseOverlay(show) {
    const banner = document.getElementById('pause-overlay');
    if (banner) {
      if (show) {
        banner.classList.remove('hidden');
      } else {
        banner.classList.add('hidden');
      }
    }
  }

  lock() {
    sound.init();
    this.controls.lock();
  }

  unlock() {
    this.resetMovement();
    this.controls.unlock();
  }

  isLocked() {
    return this.controls.isLocked;
  }

  triggerInspect(product) {
    sound.playInspect();
    this.setModalOpen(true);
    if (this.onInspect) {
      this.onInspect(product);
    }
  }

  teleportTo(x, z) {
    this.camera.position.x = x;
    this.camera.position.z = z;
    this.resetMovement();
    if (!this.controls.isLocked && !this.externalModalOpen) {
      this.lock();
    }
  }

  update(delta) {
    if (!this.controls.isLocked) return;

    // Movement damping
    this.velocity.x -= this.velocity.x * this.damping * delta;
    this.velocity.z -= this.velocity.z * this.damping * delta;

    this.direction.z = Number(this.moveState.forward) - Number(this.moveState.backward);
    this.direction.x = Number(this.moveState.right) - Number(this.moveState.left);
    this.direction.normalize();

    const speed = this.moveState.sprint ? this.sprintSpeed : this.baseSpeed;

    if (this.moveState.forward || this.moveState.backward) {
      this.velocity.z -= this.direction.z * speed * 10.0 * delta;
    }
    if (this.moveState.left || this.moveState.right) {
      this.velocity.x -= this.direction.x * speed * 10.0 * delta;
    }

    // Apply translation
    this.controls.moveRight(-this.velocity.x * delta);
    this.controls.moveForward(-this.velocity.z * delta);

    // Subtle head bobbing
    const isMoving = Math.abs(this.velocity.x) > 0.2 || Math.abs(this.velocity.z) > 0.2;
    if (isMoving) {
      const bobFreq = this.moveState.sprint ? 14 : 10;
      this.bobTimer += delta * bobFreq;
      this.camera.position.y = this.defaultEyeHeight + Math.sin(this.bobTimer) * 0.035;

      if (Math.sin(this.bobTimer) < -0.92) {
        sound.playFootstep();
      }
    } else {
      this.camera.position.y = THREE.MathUtils.lerp(this.camera.position.y, this.defaultEyeHeight, 0.1);
    }

    // Simple smooth boundary check (keeps user inside store)
    this.handleBoundaries();

    // Crosshair Raycast
    this.updateCrosshairRaycast();
  }

  handleBoundaries() {
    const pos = this.camera.position;

    // 1. Store perimeter walls
    pos.x = Math.max(this.bounds.minX, Math.min(this.bounds.maxX, pos.x));
    pos.z = Math.max(this.bounds.minZ, Math.min(this.bounds.maxZ, pos.z));

    // 2. Gentle plinth collision (simple radial push without corner traps)
    for (const p of this.plinthPositions) {
      const dx = pos.x - p.x;
      const dz = pos.z - p.z;
      const distSq = dx * dx + dz * dz;
      const minDist = 1.15;
      if (distSq < minDist * minDist && distSq > 0.0001) {
        const dist = Math.sqrt(distSq);
        const push = minDist - dist;
        pos.x += (dx / dist) * push;
        pos.z += (dz / dist) * push;
      }
    }
  }

  updateCrosshairRaycast() {
    this.raycaster.setFromCamera(this.centerScreen, this.camera);
    const intersects = this.raycaster.intersectObjects(this.interactables, true);

    let hitProduct = null;

    if (intersects.length > 0 && intersects[0].distance < 5.0) {
      let obj = intersects[0].object;
      while (obj && !obj.userData?.isProduct) {
        obj = obj.parent;
      }
      if (obj && obj.userData?.data) {
        hitProduct = obj.userData.data;
      }
    }

    if (hitProduct !== this.hoveredProduct) {
      this.hoveredProduct = hitProduct;
      if (this.hoveredProduct) {
        if (this.lastHoveredId !== this.hoveredProduct.id) {
          sound.playHover();
          this.lastHoveredId = this.hoveredProduct.id;
        }
      } else {
        this.lastHoveredId = null;
      }
    }

    this.updateCrosshairUI(this.hoveredProduct);
  }

  updateCrosshairUI(product) {
    const crosshair = document.getElementById('crosshair');
    const prompt = document.getElementById('crosshair-prompt');
    if (!crosshair || !prompt) return;

    if (product) {
      crosshair.classList.add('focused');
      prompt.style.display = 'block';
      prompt.innerHTML = `<strong>${product.name}</strong><span>Click or [E] to Inspect</span>`;
    } else {
      crosshair.classList.remove('focused');
      prompt.style.display = 'none';
    }
  }
}
