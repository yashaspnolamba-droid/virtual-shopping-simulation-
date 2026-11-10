/**
 * 3D Procedural Product Builder & Material Engine
 * Generates high-fidelity PBR models with realistic materials, textures, and interactive highlights.
 */

import * as THREE from 'three';

// Create a realistic canvas texture for the smartwatch face
function createWatchFaceTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#0a0d14';
  ctx.fillRect(0, 0, 512, 512);

  // Outer radial gradient ring
  const grad = ctx.createRadialGradient(256, 256, 180, 256, 256, 240);
  grad.addColorStop(0, 'rgba(56, 189, 248, 0.1)');
  grad.addColorStop(1, 'rgba(56, 189, 248, 0.4)');
  ctx.strokeStyle = grad;
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.arc(256, 256, 210, -Math.PI * 0.8, Math.PI * 0.5);
  ctx.stroke();

  // Activity ring (Orange)
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(256, 256, 190, -Math.PI * 0.5, Math.PI * 0.7);
  ctx.stroke();

  // Activity ring (Green)
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(256, 256, 172, -Math.PI * 0.5, Math.PI * 0.3);
  ctx.stroke();

  // Time
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 96px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('10:42', 256, 230);

  // Date
  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 24px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillText('TUE 29 OCT', 256, 150);

  // Heart rate & BPM
  ctx.fillStyle = '#ef4444';
  ctx.font = 'bold 28px sans-serif';
  ctx.fillText('♥ 74 BPM', 256, 320);

  // Battery
  ctx.fillStyle = '#38bdf8';
  ctx.font = '500 22px sans-serif';
  ctx.fillText('88% CHARGED', 256, 360);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  return texture;
}

// Camera lens element texture
function createCameraLensTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#050505';
  ctx.fillRect(0, 0, 512, 512);

  // Circular rings
  for (let r = 240; r > 40; r -= 25) {
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(256, 256, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Lens specs text printed around rim
  ctx.save();
  ctx.translate(256, 256);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = '#d4d4d8';
  ctx.font = 'bold 18px monospace';
  const text = 'VANGUARD CINEMA LENS F/1.4 35MM Ø 72MM ED NANO COATING';
  for (let i = 0; i < text.length; i++) {
    ctx.save();
    const angle = (i / text.length) * Math.PI * 1.8;
    ctx.rotate(angle);
    ctx.fillText(text[i], 0, -210);
    ctx.restore();
  }
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

/**
 * Procedural 3D Model Generators
 */
export function createProduct3D(product) {
  const group = new THREE.Group();
  group.name = product.id;
  group.userData = {
    isProduct: true,
    data: product,
    colorMeshes: []
  };

  const primaryHex = product.colors[0].primary;
  const accentHex = product.colors[0].accent;

  switch (product.modelType) {
    case 'headphones':
      buildHeadphonesModel(group, primaryHex, accentHex);
      break;
    case 'watch':
      buildWatchModel(group, primaryHex, accentHex);
      break;
    case 'keyboard':
      buildKeyboardModel(group, primaryHex, accentHex);
      break;
    case 'camera':
      buildCameraModel(group, primaryHex, accentHex);
      break;
    case 'sneaker':
      buildSneakerModel(group, primaryHex, accentHex);
      break;
    case 'glasses':
      buildGlassesModel(group, primaryHex, accentHex);
      break;
    default:
      buildDefaultBox(group, primaryHex);
  }

  // Enable shadows
  group.traverse(child => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      child.userData.parentProduct = group;
    }
  });

  return group;
}

/**
 * 1. Studio Headphones Model
 */
function buildHeadphonesModel(group, primaryHex, accentHex) {
  const headGroup = new THREE.Group();

  // Primary material (cups & band body)
  const cupMat = new THREE.MeshStandardMaterial({
    color: primaryHex,
    metalness: 0.6,
    roughness: 0.25
  });
  group.userData.colorMeshes.push(cupMat);

  // Accent metallic material
  const metalMat = new THREE.MeshStandardMaterial({
    color: accentHex,
    metalness: 0.9,
    roughness: 0.15
  });

  // Soft leather pads material
  const cushionMat = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    roughness: 0.9,
    metalness: 0.05
  });

  // Headband arch
  const headbandCurve = new THREE.EllipseCurve(0, 0, 0.45, 0.45, 0, Math.PI, false, 0);
  const points = headbandCurve.getPoints(32);
  const curve3D = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(p.x, p.y + 0.05, 0)));
  const headbandGeom = new THREE.TubeGeometry(curve3D, 32, 0.035, 16, false);
  const headbandMesh = new THREE.Mesh(headbandGeom, cupMat);
  headGroup.add(headbandMesh);

  // Soft headband inner cushion
  const innerHeadbandGeom = new THREE.TubeGeometry(curve3D, 32, 0.02, 12, false);
  const innerCushion = new THREE.Mesh(innerHeadbandGeom, cushionMat);
  innerCushion.scale.set(0.96, 0.94, 0.96);
  headGroup.add(innerCushion);

  // Earcups builder
  [-0.45, 0.45].forEach(side => {
    const cupSideGroup = new THREE.Group();
    cupSideGroup.position.set(side, 0.05, 0);

    // Stem slider
    const stemGeom = new THREE.CylinderGeometry(0.015, 0.015, 0.18, 16);
    const stem = new THREE.Mesh(stemGeom, metalMat);
    stem.position.y = -0.05;
    cupSideGroup.add(stem);

    // Gimbal ring
    const gimbalGeom = new THREE.TorusGeometry(0.09, 0.012, 12, 24, Math.PI);
    const gimbal = new THREE.Mesh(gimbalGeom, metalMat);
    gimbal.position.y = -0.14;
    gimbal.rotation.z = Math.PI;
    cupSideGroup.add(gimbal);

    // Earcup shell
    const shellGeom = new THREE.CylinderGeometry(0.14, 0.12, 0.1, 32);
    shellGeom.rotateZ(Math.PI / 2);
    const shell = new THREE.Mesh(shellGeom, cupMat);
    shell.position.set(side > 0 ? -0.02 : 0.02, -0.22, 0);
    cupSideGroup.add(shell);

    // Earcup cushion
    const padGeom = new THREE.TorusGeometry(0.12, 0.045, 16, 32);
    padGeom.rotateY(Math.PI / 2);
    const pad = new THREE.Mesh(padGeom, cushionMat);
    pad.position.set(side > 0 ? -0.06 : 0.06, -0.22, 0);
    cupSideGroup.add(pad);

    // Metal accent ring on outer cup
    const ringGeom = new THREE.RingGeometry(0.09, 0.11, 32);
    ringGeom.rotateY(side > 0 ? Math.PI / 2 : -Math.PI / 2);
    const ring = new THREE.Mesh(ringGeom, metalMat);
    ring.position.set(side > 0 ? 0.035 : -0.035, -0.22, 0);
    cupSideGroup.add(ring);

    // Emissive indicator
    const ledGeom = new THREE.SphereGeometry(0.008, 12, 12);
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const led = new THREE.Mesh(ledGeom, ledMat);
    led.position.set(side > 0 ? 0.038 : -0.038, -0.28, 0.04);
    cupSideGroup.add(led);

    headGroup.add(cupSideGroup);
  });

  headGroup.position.y = 0.28;
  group.add(headGroup);
}

/**
 * 2. Smartwatch Model
 */
function buildWatchModel(group, primaryHex, accentHex) {
  const watchGroup = new THREE.Group();

  // Titanium body material
  const bodyMat = new THREE.MeshStandardMaterial({
    color: primaryHex,
    metalness: 0.85,
    roughness: 0.25
  });
  group.userData.colorMeshes.push(bodyMat);

  // Watch case
  const caseGeom = new THREE.CylinderGeometry(0.24, 0.24, 0.065, 36);
  const caseMesh = new THREE.Mesh(caseGeom, bodyMat);
  watchGroup.add(caseMesh);

  // Bevel bezel ring
  const bezelGeom = new THREE.TorusGeometry(0.23, 0.015, 16, 48);
  bezelGeom.rotateX(Math.PI / 2);
  const bezelMesh = new THREE.Mesh(bezelGeom, bodyMat);
  bezelMesh.position.y = 0.03;
  watchGroup.add(bezelMesh);

  // Screen display
  const screenGeom = new THREE.CircleGeometry(0.22, 36);
  screenGeom.rotateX(-Math.PI / 2);
  const screenMat = new THREE.MeshBasicMaterial({
    map: createWatchFaceTexture()
  });
  const screenMesh = new THREE.Mesh(screenGeom, screenMat);
  screenMesh.position.y = 0.035;
  watchGroup.add(screenMesh);

  // Digital Crown button
  const crownGeom = new THREE.CylinderGeometry(0.03, 0.03, 0.04, 20);
  crownGeom.rotateZ(Math.PI / 2);
  const crownMat = new THREE.MeshStandardMaterial({
    color: accentHex,
    metalness: 0.9,
    roughness: 0.2
  });
  const crownMesh = new THREE.Mesh(crownGeom, crownMat);
  crownMesh.position.set(0.25, 0.005, 0.05);
  watchGroup.add(crownMesh);

  // Silicone / Leather strap curved over display stand
  const strapMat = new THREE.MeshStandardMaterial({
    color: 0x1e2430,
    roughness: 0.8
  });

  const strapCurvePoints = [
    new THREE.Vector3(0, 0.02, 0.22),
    new THREE.Vector3(0, -0.05, 0.32),
    new THREE.Vector3(0, -0.22, 0.30),
    new THREE.Vector3(0, -0.28, 0.15)
  ];
  const strapCurve = new THREE.CatmullRomCurve3(strapCurvePoints);
  const strapGeom = new THREE.TubeGeometry(strapCurve, 24, 0.08, 12, false);
  strapGeom.scale(1.2, 0.2, 1);
  const strapTop = new THREE.Mesh(strapGeom, strapMat);
  watchGroup.add(strapTop);

  const strapBottom = strapTop.clone();
  strapBottom.rotation.y = Math.PI;
  watchGroup.add(strapBottom);

  watchGroup.rotation.x = 0.35;
  watchGroup.position.y = 0.22;
  group.add(watchGroup);
}

/**
 * 3. Mechanical Keyboard Model
 */
function buildKeyboardModel(group, primaryHex, accentHex) {
  const kbGroup = new THREE.Group();

  // CNC Base material
  const baseMat = new THREE.MeshStandardMaterial({
    color: primaryHex,
    metalness: 0.7,
    roughness: 0.3
  });
  group.userData.colorMeshes.push(baseMat);

  // Chassis
  const chassisGeom = new THREE.BoxGeometry(0.85, 0.06, 0.35);
  const chassisMesh = new THREE.Mesh(chassisGeom, baseMat);
  kbGroup.add(chassisMesh);

  // RGB underglow strip
  const rgbGeom = new THREE.BoxGeometry(0.87, 0.015, 0.37);
  const rgbMat = new THREE.MeshBasicMaterial({
    color: accentHex
  });
  const rgbMesh = new THREE.Mesh(rgbGeom, rgbMat);
  rgbMesh.position.y = -0.02;
  kbGroup.add(rgbMesh);

  // Keycaps grid
  const keyMatDark = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.6 });
  const keyMatLight = new THREE.MeshStandardMaterial({ color: 0xe5e7eb, roughness: 0.6 });
  const keyMatAccent = new THREE.MeshStandardMaterial({ color: accentHex, roughness: 0.4 });

  const rows = 5;
  const cols = 14;
  const keyW = 0.05;
  const keyD = 0.05;
  const keyH = 0.025;

  const keyGeom = new THREE.BoxGeometry(keyW, keyH, keyD);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Skip some spots for layout realism
      if (r === rows - 1 && c > 3 && c < 9) continue; // Spacebar slot

      let mat = keyMatDark;
      if (r > 1 && c > 1 && c < 12) mat = keyMatLight;
      if (c === 0 || c === cols - 1 || (r === 0 && c === 0)) mat = keyMatAccent;

      const key = new THREE.Mesh(keyGeom, mat);
      key.position.set(
        (c - cols / 2 + 0.5) * 0.056,
        0.04,
        (r - rows / 2 + 0.5) * 0.056
      );
      kbGroup.add(key);
    }
  }

  // Spacebar
  const spaceGeom = new THREE.BoxGeometry(0.28, keyH, keyD);
  const spacebar = new THREE.Mesh(spaceGeom, keyMatAccent);
  spacebar.position.set(0, 0.04, (rows - 1 - rows / 2 + 0.5) * 0.056);
  kbGroup.add(spacebar);

  kbGroup.rotation.x = 0.2;
  kbGroup.position.y = 0.12;
  group.add(kbGroup);
}

/**
 * 4. Mirrorless Cinema Camera Model
 */
function buildCameraModel(group, primaryHex, accentHex) {
  const camGroup = new THREE.Group();

  // Body material
  const bodyMat = new THREE.MeshStandardMaterial({
    color: primaryHex,
    roughness: 0.4,
    metalness: 0.5
  });
  group.userData.colorMeshes.push(bodyMat);

  // Camera main body block
  const bodyGeom = new THREE.BoxGeometry(0.48, 0.32, 0.2);
  const body = new THREE.Mesh(bodyGeom, bodyMat);
  camGroup.add(body);

  // Grip handle
  const gripGeom = new THREE.BoxGeometry(0.12, 0.3, 0.12);
  const gripMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    roughness: 0.95
  });
  const grip = new THREE.Mesh(gripGeom, gripMat);
  grip.position.set(-0.19, -0.01, 0.08);
  camGroup.add(grip);

  // EVF Viewfinder hump
  const evfGeom = new THREE.BoxGeometry(0.14, 0.08, 0.12);
  const evf = new THREE.Mesh(evfGeom, bodyMat);
  evf.position.set(0.04, 0.18, 0);
  camGroup.add(evf);

  // Top dials
  const dialGeom = new THREE.CylinderGeometry(0.04, 0.04, 0.04, 20);
  const dialMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.3 });
  const dial1 = new THREE.Mesh(dialGeom, dialMat);
  dial1.position.set(-0.15, 0.17, -0.02);
  const dial2 = new THREE.Mesh(dialGeom, dialMat);
  dial2.position.set(0.18, 0.17, -0.02);
  camGroup.add(dial1, dial2);

  // Shutter button
  const shutterGeom = new THREE.CylinderGeometry(0.02, 0.02, 0.03, 16);
  const shutterMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.1 });
  const shutter = new THREE.Mesh(shutterGeom, shutterMat);
  shutter.position.set(-0.19, 0.165, 0.08);
  camGroup.add(shutter);

  // Multi-stage Cinema Lens Barrel
  const lensGroup = new THREE.Group();
  lensGroup.position.set(0.04, 0, 0.1);

  // Mount flange
  const flangeGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.05, 32);
  flangeGeom.rotateX(Math.PI / 2);
  const flangeMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 });
  const flange = new THREE.Mesh(flangeGeom, flangeMat);
  flange.position.z = 0.025;
  lensGroup.add(flange);

  // Cinema red accent ring
  const redRingGeom = new THREE.CylinderGeometry(0.145, 0.145, 0.015, 32);
  redRingGeom.rotateX(Math.PI / 2);
  const redRingMat = new THREE.MeshBasicMaterial({ color: accentHex });
  const redRing = new THREE.Mesh(redRingGeom, redRingMat);
  redRing.position.z = 0.06;
  lensGroup.add(redRing);

  // Barrel body with focus ribs
  const barrelGeom = new THREE.CylinderGeometry(0.14, 0.14, 0.24, 32);
  barrelGeom.rotateX(Math.PI / 2);
  const barrelMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3, metalness: 0.6 });
  const barrel = new THREE.Mesh(barrelGeom, barrelMat);
  barrel.position.z = 0.18;
  lensGroup.add(barrel);

  // Front Lens Glass Element with aperture markings
  const frontPlateGeom = new THREE.CircleGeometry(0.13, 32);
  const frontPlateMat = new THREE.MeshBasicMaterial({
    map: createCameraLensTexture()
  });
  const frontPlate = new THREE.Mesh(frontPlateGeom, frontPlateMat);
  frontPlate.position.z = 0.301;
  lensGroup.add(frontPlate);

  // Curved glass coating
  const glassGeom = new THREE.SphereGeometry(0.11, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.35);
  glassGeom.rotateX(Math.PI / 2);
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x67e8f9,
    metalness: 0.1,
    roughness: 0.05,
    transmission: 0.85,
    transparent: true,
    opacity: 0.65,
    reflectivity: 0.9
  });
  const glass = new THREE.Mesh(glassGeom, glassMat);
  glass.position.z = 0.28;
  lensGroup.add(glass);

  camGroup.add(lensGroup);
  camGroup.position.y = 0.18;
  group.add(camGroup);
}

/**
 * 5. Futuristic Parametric Sneaker Model
 */
function buildSneakerModel(group, primaryHex, accentHex) {
  const shoeGroup = new THREE.Group();

  // Upper material
  const upperMat = new THREE.MeshStandardMaterial({
    color: primaryHex,
    roughness: 0.65,
    metalness: 0.1
  });
  group.userData.colorMeshes.push(upperMat);

  // Accent lattice sole material
  const soleMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    roughness: 0.2,
    metalness: 0.1
  });

  // Outsole
  const soleGeom = new THREE.BoxGeometry(0.24, 0.08, 0.64);
  const sole = new THREE.Mesh(soleGeom, soleMat);
  sole.position.y = 0.04;
  shoeGroup.add(sole);

  // Lattice cutouts / layered midsole
  for (let i = -3; i <= 3; i++) {
    const strutGeom = new THREE.CylinderGeometry(0.015, 0.015, 0.25, 12);
    strutGeom.rotateZ(Math.PI / 2);
    const strutMat = new THREE.MeshBasicMaterial({ color: accentHex });
    const strut = new THREE.Mesh(strutGeom, strutMat);
    strut.position.set(0, 0.04, i * 0.08);
    shoeGroup.add(strut);
  }

  // Upper foot shape
  const footGeom = new THREE.BoxGeometry(0.22, 0.16, 0.58);
  const foot = new THREE.Mesh(footGeom, upperMat);
  foot.position.set(0, 0.15, -0.02);
  shoeGroup.add(foot);

  // Ankle collar
  const collarGeom = new THREE.CylinderGeometry(0.09, 0.11, 0.14, 20);
  collarGeom.scale(1, 1, 1.3);
  const collar = new THREE.Mesh(collarGeom, upperMat);
  collar.position.set(0, 0.25, -0.12);
  shoeGroup.add(collar);

  // Tongue & Laces
  for (let l = 0; l < 4; l++) {
    const laceGeom = new THREE.BoxGeometry(0.12, 0.012, 0.02);
    const laceMat = new THREE.MeshStandardMaterial({ color: accentHex, roughness: 0.5 });
    const lace = new THREE.Mesh(laceGeom, laceMat);
    lace.position.set(0, 0.22 + l * 0.02, 0.04 + l * 0.06);
    lace.rotation.x = -0.3;
    shoeGroup.add(lace);
  }

  // Sleek side aerodynamic stripe
  const stripeGeom = new THREE.BoxGeometry(0.23, 0.03, 0.32);
  const stripeMat = new THREE.MeshBasicMaterial({ color: accentHex });
  const stripe = new THREE.Mesh(stripeGeom, stripeMat);
  stripe.position.set(0, 0.14, 0.02);
  shoeGroup.add(stripe);

  shoeGroup.position.y = 0.06;
  shoeGroup.rotation.y = 0.45;
  group.add(shoeGroup);
}

/**
 * 6. AR Smart Glasses Model
 */
function buildGlassesModel(group, primaryHex, accentHex) {
  const glassesGroup = new THREE.Group();

  // Frame material
  const frameMat = new THREE.MeshStandardMaterial({
    color: primaryHex,
    metalness: 0.7,
    roughness: 0.2
  });
  group.userData.colorMeshes.push(frameMat);

  // Lenses material (polarized translucent with AR holographic shimmer)
  const lensMat = new THREE.MeshPhysicalMaterial({
    color: 0x06b6d4,
    transparent: true,
    opacity: 0.7,
    roughness: 0.1,
    transmission: 0.6,
    reflectivity: 0.8
  });

  // Dual Browline rims
  [-0.14, 0.14].forEach(x => {
    const rimGeom = new THREE.TorusGeometry(0.11, 0.016, 12, 32);
    const rim = new THREE.Mesh(rimGeom, frameMat);
    rim.position.set(x, 0.16, 0.12);
    glassesGroup.add(rim);

    const lensGeom = new THREE.CircleGeometry(0.10, 32);
    const lens = new THREE.Mesh(lensGeom, lensMat);
    lens.position.set(x, 0.16, 0.12);
    glassesGroup.add(lens);

    // Waveguide HUD projection dot on glass edge
    const hudDotGeom = new THREE.SphereGeometry(0.008, 8, 8);
    const hudDotMat = new THREE.MeshBasicMaterial({ color: accentHex });
    const hudDot = new THREE.Mesh(hudDotGeom, hudDotMat);
    hudDot.position.set(x + (x > 0 ? 0.06 : -0.06), 0.2, 0.125);
    glassesGroup.add(hudDot);
  });

  // Nose bridge
  const bridgeGeom = new THREE.CylinderGeometry(0.012, 0.012, 0.1, 12);
  bridgeGeom.rotateZ(Math.PI / 2);
  const bridge = new THREE.Mesh(bridgeGeom, frameMat);
  bridge.position.set(0, 0.18, 0.12);
  glassesGroup.add(bridge);

  // Left & Right temple stems
  [-0.26, 0.26].forEach(x => {
    const stemGeom = new THREE.BoxGeometry(0.018, 0.024, 0.38);
    const stem = new THREE.Mesh(stemGeom, frameMat);
    stem.position.set(x, 0.17, -0.07);
    glassesGroup.add(stem);

    // Temple battery tip
    const tipGeom = new THREE.CylinderGeometry(0.012, 0.015, 0.08, 12);
    tipGeom.rotateX(0.4);
    const tipMat = new THREE.MeshStandardMaterial({ color: accentHex, metalness: 0.8, roughness: 0.2 });
    const tip = new THREE.Mesh(tipGeom, tipMat);
    tip.position.set(x, 0.14, -0.25);
    glassesGroup.add(tip);
  });

  glassesGroup.position.y = 0.08;
  glassesGroup.rotation.y = -0.3;
  group.add(glassesGroup);
}

/**
 * Fallback geometry
 */
function buildDefaultBox(group, primaryHex) {
  const boxGeom = new THREE.BoxGeometry(0.3, 0.3, 0.3);
  const boxMat = new THREE.MeshStandardMaterial({ color: primaryHex, metalness: 0.5, roughness: 0.3 });
  group.userData.colorMeshes.push(boxMat);
  const box = new THREE.Mesh(boxGeom, boxMat);
  box.position.y = 0.2;
  group.add(box);
}

/**
 * Creates the sleek display plinth / pedestal for each product
 */
export function createDisplayPlinth(product) {
  const plinth = new THREE.Group();
  plinth.position.set(product.shelfPos.x, 0, product.shelfPos.z);

  // Base cylinder (brushed dark steel)
  const baseGeom = new THREE.CylinderGeometry(0.85, 0.9, 0.9, 36);
  const baseMat = new THREE.MeshStandardMaterial({
    color: 0x1f242d,
    roughness: 0.35,
    metalness: 0.7
  });
  const baseMesh = new THREE.Mesh(baseGeom, baseMat);
  baseMesh.position.y = 0.45;
  baseMesh.castShadow = true;
  baseMesh.receiveShadow = true;
  plinth.add(baseMesh);

  // Warm walnut wood trim band
  const trimGeom = new THREE.CylinderGeometry(0.86, 0.86, 0.08, 36);
  const trimMat = new THREE.MeshStandardMaterial({
    color: 0x8b5a2b,
    roughness: 0.6,
    metalness: 0.1
  });
  const trimMesh = new THREE.Mesh(trimGeom, trimMat);
  trimMesh.position.y = 0.86;
  trimMesh.castShadow = true;
  trimMesh.receiveShadow = true;
  plinth.add(trimMesh);

  // Top surface glass / marble disc
  const topGeom = new THREE.CylinderGeometry(0.82, 0.82, 0.04, 36);
  const topMat = new THREE.MeshStandardMaterial({
    color: 0x272e3b,
    roughness: 0.15,
    metalness: 0.85
  });
  const topMesh = new THREE.Mesh(topGeom, topMat);
  topMesh.position.y = 0.92;
  topMesh.receiveShadow = true;
  plinth.add(topMesh);

  // Floor ambient spotlight halo
  const haloGeom = new THREE.RingGeometry(0.95, 1.25, 36);
  haloGeom.rotateX(-Math.PI / 2);
  const haloMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.22,
    side: THREE.DoubleSide
  });
  const haloMesh = new THREE.Mesh(haloGeom, haloMat);
  haloMesh.position.y = 0.01;
  plinth.add(haloMesh);

  // Interactive pulse ring (visible on hover)
  const pulseGeom = new THREE.RingGeometry(0.85, 0.92, 36);
  pulseGeom.rotateX(-Math.PI / 2);
  const pulseMat = new THREE.MeshBasicMaterial({
    color: 0x67e8f9,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide
  });
  const pulseMesh = new THREE.Mesh(pulseGeom, pulseMat);
  pulseMesh.position.y = 0.945;
  plinth.add(pulseMesh);
  plinth.userData.pulseMesh = pulseMesh;

  return plinth;
}
