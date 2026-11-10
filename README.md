# VELOCITY | 3D Concept Boutique & Virtual Shopping Experience

A modern, high-fidelity first-person virtual retail boutique simulation built with **Three.js** and **Vite**.

## ✨ Features

- **First-Person Roaming View:**
  - Immersive `PointerLockControls` with mouse-look and keyboard walking (`W`, `A`, `S`, `D`, `Shift` to sprint).
  - Physics damping and smooth deceleration.
  - Spatial collision boundaries keeping the player inside the boutique and preventing walking through pedestals or benches.
  - Subtle head-bobbing and procedural footsteps sound.

- **Flagship Boutique Architecture & Atmosphere:**
  - Polished terrazzo/marble floor with procedural specular tile texture.
  - Architectural wooden slat accent walls and dark concrete finishes.
  - Floor-to-ceiling glass display window with zen courtyard vista.
  - Suspended track spotlights casting real-time soft shadows on each product.
  - Suspended luminous category banners: *Acoustics & Hi-Fi*, *Optics & Runners*.
  - Potted architectural fiddle-leaf fig plants and center lounge leather bench.

- **High-Fidelity 3D Product Models (PBR):**
  1. **Aura Pro Studio Headphones:** Arched padded headband, brushed aluminum sliders, memory foam earcups, metallic grille, and LED status dot.
  2. **Chronos Neo Titan Smartwatch:** Grade 5 titanium case, tactile digital crown, curved strap, and procedural canvas OLED display with clock, battery, and fitness rings.
  3. **Keyverse Apex Mechanical Deck:** CNC milled aluminum chassis, 75% keycaps layout, PBT dye-sub caps, and RGB underglow diffusion.
  4. **Lumix Vanguard Cinema Camera:** Weather-sealed textured magnesium body, dials, shutter button, multi-stage cinema lens barrel with red ring, and physical glass lens element.
  5. **Apex Quantum Kinetic Runner:** Parametric 3D-printed lattice midsole, carbon fiber plate, aerodynamic contour, and knit upper.
  6. **Spectra Vision AR Spectacles:** Browline titanium frame, micro-waveguide HUD projector, and polarized translucent lenses.

- **Interactive Hover & Reticle Feedback:**
  - Center crosshair dynamically expands when aiming at a product within interaction distance.
  - In-world display plinths illuminate with an animated glowing pulse ring.
  - Products gently levitate and showcase-spin when looked at.
  - Floating 3D price tags rendered using `CSS2DRenderer` for ultra-crisp vector typography in 3D space.

- **Product Inspection Modal & 360° 3D Orbit Preview:**
  - Click or press `E` on any product to open the luxury product sheet.
  - Includes a secondary interactive 3D WebGL canvas allowing full 360° click-and-drag rotation.
  - Real-time material finish/color customizer (e.g., Space Black, Silver Mist, Champagne Gold) which updates the 3D model in real time!
  - Technical specifications table, star ratings, and price formatted with `Intl.NumberFormat`.

- **Shopping Cart & Checkout System:**
  - Slide-out shopping bag drawer (`Press C` or click cart button).
  - Quantity adjusters, subtotal calculation, simulated 8% tax, and free shipping tracker.
  - Complete checkout flow with order confirmation modal and generated order tracking ID.

- **Procedural Web Audio Engine:**
  - Built with the native browser Web Audio API — 0 external audio files needed!
  - Realistic footsteps, hover blips, inspection chimes, and checkout fanfare.
  - Mute/Unmute sound toggle.

- **Minimap Radar HUD:**
  - Real-time mini radar showing player position, orientation vision cone, and product locations.
  - Quick teleport shortcuts for immediate navigation.

---

## 🚀 Running the Project

```bash
cd virtual-shop
npm run dev
```

Then open the local URL (usually `http://localhost:5173`) in any modern browser (Chrome, Edge, Firefox, Brave, Safari).

### Production Build
```bash
npm run build
npm run preview
```
