/**
 * UI & HUD Manager - Streamlined & Glitch-Free
 * Handles product inspection modal, color customizer, cart drawer, and seamless first-person lock/unlock.
 */

import { formatPrice } from '../data/products.js';
import { sound } from '../utils/audio.js';

export class UIManager {
  constructor(controller, onColorChangeCallback) {
    this.controller = controller;
    this.onColorChange = onColorChangeCallback;

    // Cart state
    this.cart = [];
    this.currentInspectedProduct = null;
    this.selectedColor = null;
    this.quantity = 1;

    this.initDOM();
    this.initEvents();
  }

  initDOM() {
    this.overlay = document.getElementById('instruction-overlay');
    this.modal = document.getElementById('product-modal');
    this.cartDrawer = document.getElementById('cart-drawer');
    this.cartCountBadge = document.getElementById('cart-count');
    this.cartTotalText = document.getElementById('cart-total');
    this.cartItemsContainer = document.getElementById('cart-items');
    this.checkoutSuccessModal = document.getElementById('checkout-success');
    this.minimapCanvas = document.getElementById('minimap-canvas');
    if (this.minimapCanvas) {
      this.minimapCtx = this.minimapCanvas.getContext('2d');
    }
  }

  initEvents() {
    // 1. Initial Start Overlay click to enter store
    if (this.overlay) {
      this.overlay.addEventListener('click', (e) => {
        e.stopPropagation();
        this.overlay.classList.add('hidden');
        this.controller.setModalOpen(false);
        this.controller.lock();
      });
    }

    // 2. Modal Close Buttons
    const closeBtn = document.getElementById('modal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeProductModal();
      });
    }

    const modalResumeBtn = document.getElementById('modal-resume-btn');
    if (modalResumeBtn) {
      modalResumeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeProductModal();
      });
    }

    // 3. Modal Add To Cart
    const addBtn = document.getElementById('modal-add-cart-btn');
    if (addBtn) {
      addBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.addToCartFromModal();
      });
    }

    // 4. Quantity buttons
    const qtyMinus = document.getElementById('qty-minus');
    const qtyPlus = document.getElementById('qty-plus');
    const qtyValue = document.getElementById('qty-value');

    if (qtyMinus && qtyPlus && qtyValue) {
      qtyMinus.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.quantity > 1) {
          this.quantity--;
          qtyValue.textContent = this.quantity;
        }
      });
      qtyPlus.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.quantity < 10) {
          this.quantity++;
          qtyValue.textContent = this.quantity;
        }
      });
    }

    // 5. Cart Toggle Button in Top HUD
    const cartToggleBtn = document.getElementById('cart-toggle-btn');
    if (cartToggleBtn) {
      cartToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleCartDrawer();
      });
    }

    // 6. Cart Drawer Close
    const cartCloseBtn = document.getElementById('cart-close-btn');
    if (cartCloseBtn) {
      cartCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeCartDrawer();
      });
    }

    // 7. Checkout button
    const checkoutBtn = document.getElementById('cart-checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.processCheckout();
      });
    }

    // 8. Close checkout success modal
    const closeCheckoutBtn = document.getElementById('close-checkout-btn');
    if (closeCheckoutBtn) {
      closeCheckoutBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.checkoutSuccessModal.classList.add('hidden');
        this.cart = [];
        this.updateCartUI();
        this.closeCartDrawer();
      });
    }

    // 9. Sound toggle button
    const soundBtn = document.getElementById('sound-toggle-btn');
    if (soundBtn) {
      soundBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const enabled = sound.toggleSound();
        soundBtn.innerHTML = enabled
          ? `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.08"/></svg> <span>Sound On</span>`
          : `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg> <span>Muted</span>`;
      });
    }

    // 10. Teleport Nav Buttons
    const teleAudio = document.getElementById('tele-audio');
    const teleOptics = document.getElementById('tele-optics');
    const teleEntrance = document.getElementById('tele-entrance');

    if (teleAudio) {
      teleAudio.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeProductModal(false);
        this.closeCartDrawer(false);
        this.controller.teleportTo(-4.5, -3.5);
      });
    }
    if (teleOptics) {
      teleOptics.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeProductModal(false);
        this.closeCartDrawer(false);
        this.controller.teleportTo(4.5, -3.5);
      });
    }
    if (teleEntrance) {
      teleEntrance.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeProductModal(false);
        this.closeCartDrawer(false);
        this.controller.teleportTo(0, 8.5);
      });
    }

    // 11. Hotkeys: 'C' for cart, 'Esc' or 'E' to close modals
    window.addEventListener('keydown', (e) => {
      if (e.key === 'c' || e.key === 'C') {
        if (!this.modal.classList.contains('active')) {
          this.toggleCartDrawer();
        }
      }
      if (e.key === 'Escape' || (e.key === 'e' && this.modal.classList.contains('active'))) {
        if (this.modal.classList.contains('active')) {
          this.closeProductModal();
        } else if (this.cartDrawer.classList.contains('open')) {
          this.closeCartDrawer();
        }
      }
    });
  }

  openProductModal(product) {
    this.currentInspectedProduct = product;
    this.quantity = 1;
    this.selectedColor = product.colors[0];

    const qtyValue = document.getElementById('qty-value');
    if (qtyValue) qtyValue.textContent = '1';

    // Populate modal elements
    document.getElementById('modal-badge').textContent = product.badge || 'Featured';
    document.getElementById('modal-title').textContent = product.name;
    document.getElementById('modal-category').textContent = product.category;
    document.getElementById('modal-price').textContent = formatPrice(product.price);
    document.getElementById('modal-rating').innerHTML = `★ ${product.rating.toFixed(1)} <span>(${product.reviews} verified reviews)</span>`;
    document.getElementById('modal-description').textContent = product.description;

    // Model visual icon
    const iconElem = document.getElementById('modal-product-icon');
    if (iconElem) {
      const icons = {
        headphones: '🎧',
        watch: '⌚',
        keyboard: '⌨️',
        camera: '📷',
        sneaker: '👟',
        glasses: '👓'
      };
      iconElem.textContent = icons[product.modelType] || '📦';
    }

    // Specs list
    const specsList = document.getElementById('modal-specs');
    specsList.innerHTML = product.specs
      .map(s => `<div class="spec-row"><span class="spec-label">${s.label}</span><span class="spec-value">${s.value}</span></div>`)
      .join('');

    // Color Swatches
    const swatchContainer = document.getElementById('modal-colors');
    swatchContainer.innerHTML = '';
    product.colors.forEach((col, idx) => {
      const swatch = document.createElement('button');
      swatch.className = `color-swatch ${idx === 0 ? 'active' : ''}`;
      swatch.style.backgroundColor = col.hex;
      swatch.title = col.name;
      swatch.addEventListener('click', (e) => {
        e.stopPropagation();
        swatchContainer.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
        document.getElementById('selected-color-name').textContent = col.name;
        this.selectedColor = col;
        this.updateModelColor(col);
      });
      swatchContainer.appendChild(swatch);
    });
    document.getElementById('selected-color-name').textContent = product.colors[0].name;

    // Show modal and unlock pointer
    this.controller.setModalOpen(true);
    this.modal.classList.add('active');
  }

  updateModelColor(colorObj) {
    if (this.onColorChange && this.currentInspectedProduct) {
      this.onColorChange(this.currentInspectedProduct.id, colorObj);
    }
  }

  closeProductModal(reLock = true) {
    this.modal.classList.remove('active');
    this.currentInspectedProduct = null;
    this.controller.setModalOpen(false);

    if (reLock) {
      // Re-engage pointer lock smoothly so the player is never stuck!
      setTimeout(() => {
        this.controller.lock();
      }, 50);
    }
  }

  addToCartFromModal() {
    if (!this.currentInspectedProduct) return;

    sound.playAddToCart();

    const existing = this.cart.find(
      item => item.id === this.currentInspectedProduct.id && item.color.name === this.selectedColor.name
    );

    if (existing) {
      existing.quantity += this.quantity;
    } else {
      this.cart.push({
        ...this.currentInspectedProduct,
        color: this.selectedColor,
        quantity: this.quantity
      });
    }

    this.updateCartUI();

    const btn = document.getElementById('modal-add-cart-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = `✓ Added to Shopping Bag!`;
    btn.classList.add('added');

    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.classList.remove('added');
      this.closeProductModal(false);
      this.openCartDrawer();
    }, 500);
  }

  toggleCartDrawer() {
    if (this.cartDrawer.classList.contains('open')) {
      this.closeCartDrawer();
    } else {
      this.openCartDrawer();
    }
  }

  openCartDrawer() {
    this.controller.setModalOpen(true);
    this.cartDrawer.classList.add('open');
  }

  closeCartDrawer(reLock = true) {
    this.cartDrawer.classList.remove('open');
    this.controller.setModalOpen(false);

    if (reLock) {
      setTimeout(() => {
        this.controller.lock();
      }, 50);
    }
  }

  updateCartUI() {
    const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    this.cartCountBadge.textContent = totalItems;
    this.cartCountBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    this.cartTotalText.textContent = formatPrice(subtotal);

    document.getElementById('drawer-subtotal').textContent = formatPrice(subtotal);
    const tax = subtotal * 0.08;
    document.getElementById('drawer-tax').textContent = formatPrice(tax);
    document.getElementById('drawer-total').textContent = formatPrice(subtotal + tax);

    if (this.cart.length === 0) {
      this.cartItemsContainer.innerHTML = `
        <div class="empty-cart-msg">
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <p>Your shopping bag is empty.</p>
          <span>Walk up to any product in the store and press E to inspect.</span>
        </div>
      `;
      document.getElementById('cart-checkout-btn').disabled = true;
      return;
    }

    document.getElementById('cart-checkout-btn').disabled = false;
    this.cartItemsContainer.innerHTML = this.cart
      .map(
        (item, index) => `
        <div class="cart-item-card">
          <div class="cart-item-color-swatch" style="background:${item.color.hex}"></div>
          <div class="cart-item-info">
            <h4>${item.name}</h4>
            <div class="cart-item-meta">
              <span>${item.color.name}</span> • <span>${formatPrice(item.price)}</span>
            </div>
            <div class="cart-item-actions">
              <div class="cart-qty-ctrl">
                <button class="cart-qty-btn" data-action="dec" data-index="${index}">-</button>
                <span>${item.quantity}</span>
                <button class="cart-qty-btn" data-action="inc" data-index="${index}">+</button>
              </div>
              <button class="cart-remove-btn" data-index="${index}">Remove</button>
            </div>
          </div>
        </div>
      `
      )
      .join('');

    this.cartItemsContainer.querySelectorAll('.cart-qty-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(e.target.dataset.index);
        const action = e.target.dataset.action;
        if (action === 'inc') {
          this.cart[idx].quantity++;
        } else if (action === 'dec') {
          this.cart[idx].quantity--;
          if (this.cart[idx].quantity <= 0) {
            this.cart.splice(idx, 1);
          }
        }
        this.updateCartUI();
      });
    });

    this.cartItemsContainer.querySelectorAll('.cart-remove-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(e.target.dataset.index);
        this.cart.splice(idx, 1);
        this.updateCartUI();
      });
    });
  }

  processCheckout() {
    if (this.cart.length === 0) return;
    sound.playCheckout();

    const subtotal = this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.08;
    const finalAmount = subtotal + tax;

    document.getElementById('checkout-order-total').textContent = formatPrice(finalAmount);
    document.getElementById('checkout-item-count').textContent = `${this.cart.reduce((s, i) => s + i.quantity, 0)} items`;

    this.checkoutSuccessModal.classList.remove('hidden');
  }

  updateMinimap(playerPos, cameraRotationY, products) {
    if (!this.minimapCtx) return;
    const ctx = this.minimapCtx;
    const w = this.minimapCanvas.width;
    const h = this.minimapCanvas.height;

    ctx.clearRect(0, 0, w, h);

    const mapX = (x) => ((x + 11) / 22) * w;
    const mapZ = (z) => ((z + 13) / 26) * h;

    // Floor outline
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(4, 4, w - 8, h - 8);

    // Products dots
    products.forEach(p => {
      const px = mapX(p.shelfPos.x);
      const pz = mapZ(p.shelfPos.z);
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(px, pz, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    // Player position
    const px = mapX(playerPos.x);
    const pz = mapZ(playerPos.z);

    // Vision cone
    ctx.save();
    ctx.translate(px, pz);
    ctx.rotate(-cameraRotationY);

    ctx.fillStyle = 'rgba(244, 63, 94, 0.25)';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, 20, -Math.PI / 4, Math.PI / 4);
    ctx.closePath();
    ctx.fill();

    // Player marker
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.restore();
  }
}
