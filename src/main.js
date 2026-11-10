/**
 * Virtual Shopping Experience - Main Application Orchestrator
 * Integrates Three.js, CSS2DRenderer, First-Person Controller, Store Environment, and Luxury HUD.
 */

import * as THREE from 'three';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { products, formatPrice } from './data/products.js';
import { buildStoreScene } from './world/store.js';
import { createProduct3D, createDisplayPlinth } from './world/products3d.js';
import { FirstPersonController } from './controls/firstPerson.js';
import { UIManager } from './ui/hud.js';

class App {
  constructor() {
    this.container = document.getElementById('canvas-container');
    this.clock = new THREE.Clock();

    this.productMeshes = new Map(); // id -> THREE.Group
    this.plinthMeshes = new Map();  // id -> THREE.Group
    this.interactableObjects = [];

    this.initThree();
    this.initStore();
    this.initProducts();
    this.initControllers();
    this.animate();

    window.addEventListener('resize', () => this.onWindowResize());
  }

  initThree() {
    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0e1117);
    this.scene.fog = new THREE.FogExp2(0x0e1117, 0.025);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );

    // 3. WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.container.appendChild(this.renderer.domElement);

    // 4. CSS2D Renderer for crisp 3D HTML labels and price tags
    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
    this.labelRenderer.domElement.style.position = 'absolute';
    this.labelRenderer.domElement.style.top = '0px';
    this.labelRenderer.domElement.style.left = '0px';
    this.labelRenderer.domElement.style.pointerEvents = 'none';
    this.labelRenderer.domElement.id = 'css2d-layer';
    document.body.appendChild(this.labelRenderer.domElement);
  }

  initStore() {
    this.storeEnvironment = buildStoreScene(this.scene);
  }

  initProducts() {
    products.forEach((product, idx) => {
      // 1. Create Display Plinth
      const plinth = createDisplayPlinth(product);
      this.scene.add(plinth);
      this.plinthMeshes.set(product.id, plinth);

      // 2. Create 3D Product Model
      const model = createProduct3D(product);
      model.position.set(product.shelfPos.x, product.shelfPos.y, product.shelfPos.z);
      model.userData.baseY = product.shelfPos.y;
      model.userData.animOffset = idx * 1.05;
      this.scene.add(model);
      this.productMeshes.set(product.id, model);
      this.interactableObjects.push(model);

      // 3. Create CSS2D Floating 3D Price Tag Placard
      const tagDiv = document.createElement('div');
      tagDiv.className = 'price-tag-3d';
      tagDiv.id = `tag-${product.id}`;
      tagDiv.innerHTML = `
        <div class="tag-badge">${product.badge || 'New'}</div>
        <div class="tag-main">
          <span class="tag-name">${product.name}</span>
          <span class="tag-price">${formatPrice(product.price)}</span>
        </div>
        <div class="tag-prompt">Press E or Click to View</div>
      `;

      const tagLabel = new CSS2DObject(tagDiv);
      // Place right above the product in 3D world
      tagLabel.position.set(0, 0.65, 0);
      model.add(tagLabel);
    });
  }

  initControllers() {
    // Controller for First Person navigation
    this.controller = new FirstPersonController(
      this.camera,
      this.renderer.domElement,
      this.interactableObjects,
      (product) => {
        this.ui.openProductModal(product);
      }
    );

    // UI Manager for modals, customizer, cart, and radar
    this.ui = new UIManager(this.controller, (productId, newColor) => {
      // Color change callback from modal to update in-world 3D model
      const model = this.productMeshes.get(productId);
      if (model && model.userData?.colorMeshes) {
        model.userData.colorMeshes.forEach(mat => {
          mat.color.setHex(newColor.primary);
        });
      }
    });
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = Math.min(this.clock.getDelta(), 0.1);
    const elapsedTime = this.clock.getElapsedTime();

    // 1. Update First-Person controls
    this.controller.update(delta);

    // 2. Hover & Floating animations for products
    const hoveredProduct = this.controller.hoveredProduct;

    products.forEach(p => {
      const model = this.productMeshes.get(p.id);
      const plinth = this.plinthMeshes.get(p.id);
      const isHovered = hoveredProduct && hoveredProduct.id === p.id;
      const tagElem = document.getElementById(`tag-${p.id}`);

      if (model) {
        // Floating gentle hover animation
        const floatOffset = Math.sin(elapsedTime * 2.0 + model.userData.animOffset) * 0.025;
        const targetY = isHovered ? model.userData.baseY + 0.08 + floatOffset : model.userData.baseY + floatOffset;
        model.position.y = THREE.MathUtils.lerp(model.position.y, targetY, 0.1);

        // Smooth continuous showcase spin
        const spinSpeed = isHovered ? 0.012 : 0.004;
        model.rotation.y += spinSpeed;
      }

      if (plinth && plinth.userData.pulseMesh) {
        const targetOpacity = isHovered ? 0.75 + Math.sin(elapsedTime * 6.0) * 0.25 : 0;
        plinth.userData.pulseMesh.material.opacity = THREE.MathUtils.lerp(
          plinth.userData.pulseMesh.material.opacity,
          targetOpacity,
          0.15
        );
      }

      if (tagElem) {
        if (isHovered) {
          tagElem.classList.add('hovered');
        } else {
          tagElem.classList.remove('hovered');
        }
      }
    });

    // 3. Update Minimap radar
    if (this.ui) {
      this.ui.updateMinimap(this.camera.position, this.camera.rotation.y, products);
    }

    // 4. Render 3D Scene
    this.renderer.render(this.scene, this.camera);

    // 5. Render 3D HTML Labels (CSS2D)
    this.labelRenderer.render(this.scene, this.camera);
  }
}

// Boot application
window.addEventListener('DOMContentLoaded', () => {
  new App();
});
