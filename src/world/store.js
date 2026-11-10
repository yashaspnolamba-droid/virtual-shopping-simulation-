/**
 * Store Architecture & Interior Environment
 * Luxury concept boutique layout with architectural wood slats, recessed lighting, and modern displays.
 */

import * as THREE from 'three';

// Generate seamless floor tile texture
function createFloorTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Base stone tone
  ctx.fillStyle = '#1e2229';
  ctx.fillRect(0, 0, 1024, 1024);

  // Marble / Terrazzo flecks
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    const r = Math.random() * 2 + 0.5;
    const brightness = Math.floor(Math.random() * 40 + 40);
    ctx.fillStyle = `rgba(${brightness}, ${brightness + 4}, ${brightness + 10}, 0.25)`;
    ctx.fillRect(x, y, r, r);
  }

  // Polished large format tile seams (256x256 tiles)
  ctx.strokeStyle = '#14171d';
  ctx.lineWidth = 3;
  for (let x = 0; x <= 1024; x += 256) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 1024);
    ctx.stroke();
  }
  for (let y = 0; y <= 1024; y += 256) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 10);
  texture.anisotropy = 8;
  return texture;
}

// Generate wood slat texture for accent walls
function createWoodTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#2b1d14';
  ctx.fillRect(0, 0, 512, 512);

  // Vertical wood slats
  const slatW = 16;
  for (let x = 0; x < 512; x += slatW) {
    // Slat face
    const tone = Math.floor(Math.random() * 20);
    ctx.fillStyle = `rgb(${140 + tone}, ${92 + tone}, ${52 + tone})`;
    ctx.fillRect(x + 2, 0, slatW - 4, 512);

    // Subtle grain lines
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    for (let g = 0; g < 4; g++) {
      ctx.fillRect(x + 3 + g * 3, 0, 1, 512);
    }

    // Groove shadow
    ctx.fillStyle = '#150e09';
    ctx.fillRect(x, 0, 2, 512);
    ctx.fillRect(x + slatW - 2, 0, 2, 512);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 2);
  return texture;
}

export function buildStoreScene(scene) {
  const storeGroup = new THREE.Group();
  scene.add(storeGroup);

  const roomWidth = 22;
  const roomDepth = 26;
  const roomHeight = 5.2;

  // 1. Polished Terrazzo Floor
  const floorGeom = new THREE.PlaneGeometry(roomWidth, roomDepth);
  const floorMat = new THREE.MeshStandardMaterial({
    map: createFloorTexture(),
    roughness: 0.22,
    metalness: 0.15
  });
  const floor = new THREE.Mesh(floorGeom, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  storeGroup.add(floor);

  // 2. High Architectural Ceiling with Wood Acoustic Baffles
  const ceilGeom = new THREE.PlaneGeometry(roomWidth, roomDepth);
  const ceilMat = new THREE.MeshStandardMaterial({
    color: 0x12151c,
    roughness: 0.8
  });
  const ceiling = new THREE.Mesh(ceilGeom, ceilMat);
  ceiling.position.y = roomHeight;
  ceiling.rotation.x = Math.PI / 2;
  storeGroup.add(ceiling);

  // Ceiling wooden beams / acoustic slats
  const beamMat = new THREE.MeshStandardMaterial({
    color: 0x222730,
    roughness: 0.7
  });
  for (let z = -12; z <= 12; z += 2.0) {
    const beamGeom = new THREE.BoxGeometry(roomWidth, 0.2, 0.12);
    const beam = new THREE.Mesh(beamGeom, beamMat);
    beam.position.set(0, roomHeight - 0.1, z);
    storeGroup.add(beam);
  }

  // Recessed Linear Warm LED Troughs in Ceiling
  [-5, 0, 5].forEach(x => {
    const stripGeom = new THREE.BoxGeometry(0.15, 0.04, roomDepth - 2);
    const stripMat = new THREE.MeshBasicMaterial({
      color: 0xfff4e6
    });
    const strip = new THREE.Mesh(stripGeom, stripMat);
    strip.position.set(x, roomHeight - 0.02, 0);
    storeGroup.add(strip);
  });

  // 3. Walls
  const wallMat = new THREE.MeshStandardMaterial({
    color: 0x1c212a,
    roughness: 0.6
  });

  // Left & Right Walls
  [-roomWidth / 2, roomWidth / 2].forEach((x, idx) => {
    const sideWallGeom = new THREE.BoxGeometry(0.4, roomHeight, roomDepth);
    const sideWall = new THREE.Mesh(sideWallGeom, wallMat);
    sideWall.position.set(x, roomHeight / 2, 0);
    sideWall.receiveShadow = true;
    storeGroup.add(sideWall);

    // Warm wood slat accent panels along walls
    const woodGeom = new THREE.BoxGeometry(0.08, roomHeight - 0.4, 18);
    const woodMat = new THREE.MeshStandardMaterial({
      map: createWoodTexture(),
      roughness: 0.5
    });
    const woodPanel = new THREE.Mesh(woodGeom, woodMat);
    woodPanel.position.set(x > 0 ? x - 0.22 : x + 0.22, roomHeight / 2, -1);
    storeGroup.add(woodPanel);
  });

  // Back Architectural Glass Window Wall (Looking out to Courtyard Garden)
  const backWallGeom = new THREE.BoxGeometry(roomWidth, roomHeight, 0.4);
  const backWall = new THREE.Mesh(backWallGeom, wallMat);
  backWall.position.set(0, roomHeight / 2, -roomDepth / 2);
  backWall.receiveShadow = true;
  storeGroup.add(backWall);

  // Large floor-to-ceiling glass display window at back
  const glassFrameGeom = new THREE.BoxGeometry(14, roomHeight - 0.8, 0.2);
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x1e293b,
    transparent: true,
    opacity: 0.35,
    roughness: 0.05,
    transmission: 0.75,
    reflectivity: 0.9
  });
  const backGlass = new THREE.Mesh(glassFrameGeom, glassMat);
  backGlass.position.set(0, roomHeight / 2, -roomDepth / 2 + 0.15);
  storeGroup.add(backGlass);

  // Ambient garden backdrop behind back glass (Zen garden stone & warm uplight)
  const backdropGeom = new THREE.PlaneGeometry(16, 6);
  const backdropMat = new THREE.MeshBasicMaterial({
    color: 0x0f172a
  });
  const backdrop = new THREE.Mesh(backdropGeom, backdropMat);
  backdrop.position.set(0, 3, -roomDepth / 2 - 2);
  storeGroup.add(backdrop);

  // Front Entrance Wall with Double Glass Doors
  const frontWallLeft = new THREE.Mesh(new THREE.BoxGeometry(roomWidth / 2 - 3, roomHeight, 0.4), wallMat);
  frontWallLeft.position.set(-roomWidth / 4 - 1.5, roomHeight / 2, roomDepth / 2);
  const frontWallRight = new THREE.Mesh(new THREE.BoxGeometry(roomWidth / 2 - 3, roomHeight, 0.4), wallMat);
  frontWallRight.position.set(roomWidth / 4 + 1.5, roomHeight / 2, roomDepth / 2);
  storeGroup.add(frontWallLeft, frontWallRight);

  // Entrance Glass Doors Frame
  const portalHeaderGeom = new THREE.BoxGeometry(6, 1.2, 0.45);
  const portalHeader = new THREE.Mesh(portalHeaderGeom, wallMat);
  portalHeader.position.set(0, roomHeight - 0.6, roomDepth / 2);
  storeGroup.add(portalHeader);

  // Store Brand Signage over Entrance
  const signCanvas = document.createElement('canvas');
  signCanvas.width = 1024;
  signCanvas.height = 256;
  const sCtx = signCanvas.getContext('2d');
  sCtx.fillStyle = '#11151c';
  sCtx.fillRect(0, 0, 1024, 256);
  sCtx.fillStyle = '#f8fafc';
  sCtx.font = 'bold 58px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  sCtx.textAlign = 'center';
  sCtx.letterSpacing = '12px';
  sCtx.fillText('V E L O C I T Y', 512, 110);
  sCtx.fillStyle = '#38bdf8';
  sCtx.font = '600 24px monospace';
  sCtx.fillText('INTERACTIVE CONCEPT BOUTIQUE', 512, 175);
  const signTex = new THREE.CanvasTexture(signCanvas);
  const signMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(5.2, 1.3),
    new THREE.MeshBasicMaterial({ map: signTex })
  );
  signMesh.position.set(0, roomHeight - 0.7, roomDepth / 2 - 0.24);
  signMesh.rotation.y = Math.PI;
  storeGroup.add(signMesh);

  // 4. Modern Aisle Category Neon Banners
  createCategoryBanner(storeGroup, 'ACOUSTICS & HI-FI', -4.5, 3.8, -2, 0);
  createCategoryBanner(storeGroup, 'OPTICS & RUNNERS', 4.5, 3.8, -2, 0);

  // 5. Architectural Potted Plants
  createPlanter(storeGroup, -8.5, 0, -10.5);
  createPlanter(storeGroup, 8.5, 0, -10.5);
  createPlanter(storeGroup, -8.5, 0, 8.5);
  createPlanter(storeGroup, 8.5, 0, 8.5);

  // 6. Center Lounge Bench / Architectural Island
  createCenterBench(storeGroup);

  // 7. Lighting System
  setupLighting(scene);

  return storeGroup;
}

function createCategoryBanner(parent, title, x, y, z, rotY) {
  const canvas = document.createElement('canvas');
  canvas.width = 768;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.roundRect(10, 10, 748, 140, 20);
  ctx.fill();

  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 4;
  ctx.roundRect(10, 10, 748, 140, 20);
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 38px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(title, 384, 80);

  const texture = new THREE.CanvasTexture(canvas);
  const geom = new THREE.PlaneGeometry(3.2, 0.7);
  const mat = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    side: THREE.DoubleSide
  });

  const banner = new THREE.Mesh(geom, mat);
  banner.position.set(x, y, z);
  banner.rotation.y = rotY;
  parent.add(banner);

  // Thin hanging steel cables
  [-1.4, 1.4].forEach(cx => {
    const cableGeom = new THREE.CylinderGeometry(0.008, 0.008, 1.4, 8);
    const cableMat = new THREE.MeshBasicMaterial({ color: 0x94a3b8 });
    const cable = new THREE.Mesh(cableGeom, cableMat);
    cable.position.set(x + cx, y + 0.7, z);
    parent.add(cable);
  });
}

function createPlanter(parent, x, y, z) {
  const planter = new THREE.Group();
  planter.position.set(x, y, z);

  // Minimalist ribbed cylinder pot
  const potGeom = new THREE.CylinderGeometry(0.55, 0.45, 1.1, 24);
  const potMat = new THREE.MeshStandardMaterial({
    color: 0x222730,
    roughness: 0.6
  });
  const pot = new THREE.Mesh(potGeom, potMat);
  pot.position.y = 0.55;
  pot.castShadow = true;
  pot.receiveShadow = true;
  planter.add(pot);

  // Soil
  const soilGeom = new THREE.CircleGeometry(0.52, 24);
  soilGeom.rotateX(-Math.PI / 2);
  const soilMat = new THREE.MeshStandardMaterial({ color: 0x1f1914, roughness: 0.95 });
  const soil = new THREE.Mesh(soilGeom, soilMat);
  soil.position.y = 1.05;
  planter.add(soil);

  // Lush Fiddle-Leaf Fig / Monstera Leaves
  const leafMat = new THREE.MeshStandardMaterial({
    color: 0x15803d,
    roughness: 0.35,
    side: THREE.DoubleSide
  });

  for (let i = 0; i < 9; i++) {
    const angle = (i / 9) * Math.PI * 2;
    const height = 1.1 + Math.random() * 0.9;
    const stemGeom = new THREE.CylinderGeometry(0.015, 0.02, height, 8);
    const stem = new THREE.Mesh(stemGeom, leafMat);
    stem.position.set(Math.cos(angle) * 0.15, 1.0 + height / 2, Math.sin(angle) * 0.15);
    stem.rotation.z = Math.cos(angle) * 0.3;
    stem.rotation.x = Math.sin(angle) * 0.3;
    planter.add(stem);

    // Broad leaf fan
    const leafGeom = new THREE.SphereGeometry(0.35, 12, 8);
    leafGeom.scale(0.8, 0.05, 1.4);
    const leaf = new THREE.Mesh(leafGeom, leafMat);
    leaf.position.set(Math.cos(angle) * 0.45, 1.0 + height, Math.sin(angle) * 0.45);
    leaf.rotation.y = angle;
    leaf.rotation.x = 0.4;
    planter.add(leaf);
  }

  parent.add(planter);
}

function createCenterBench(parent) {
  const bench = new THREE.Group();
  bench.position.set(0, 0, -1.5);

  // Solid dark terrazzo bench block
  const blockGeom = new THREE.BoxGeometry(3.6, 0.48, 1.2);
  const blockMat = new THREE.MeshStandardMaterial({
    color: 0x222630,
    roughness: 0.4,
    metalness: 0.3
  });
  const block = new THREE.Mesh(blockGeom, blockMat);
  block.position.y = 0.24;
  block.castShadow = true;
  block.receiveShadow = true;
  bench.add(block);

  // Leather bench cushion topper
  const cushionGeom = new THREE.BoxGeometry(3.4, 0.08, 1.0);
  const cushionMat = new THREE.MeshStandardMaterial({
    color: 0x8b5a2b,
    roughness: 0.7
  });
  const cushion = new THREE.Mesh(cushionGeom, cushionMat);
  cushion.position.y = 0.52;
  cushion.castShadow = true;
  bench.add(cushion);

  // Under-bench warm amber accent glow
  const glowLight = new THREE.PointLight(0xf59e0b, 0.8, 4);
  glowLight.position.set(0, 0.1, 0);
  bench.add(glowLight);

  parent.add(bench);
}

function setupLighting(scene) {
  // Soft ambient bounce light
  const ambient = new THREE.AmbientLight(0xffffff, 0.65);
  scene.add(ambient);

  // Subtle hemisphere fill
  const hemi = new THREE.HemisphereLight(0xe0f2fe, 0x1e293b, 0.45);
  scene.add(hemi);

  // Aisle Spotlights pointing directly down at product zones
  const spotPositions = [
    { x: -4.5, z: -5.5 },
    { x: -4.5, z: -1.5 },
    { x: -4.5, z: 2.5 },
    { x: 4.5, z: -5.5 },
    { x: 4.5, z: -1.5 },
    { x: 4.5, z: 2.5 },
    { x: 0, z: -1.5 }, // Bench center
    { x: 0, z: 7.0 }   // Entrance
  ];

  spotPositions.forEach(pos => {
    const spot = new THREE.SpotLight(0xfffaf0, 1.8, 12, Math.PI / 4, 0.4, 1.2);
    spot.position.set(pos.x, 4.8, pos.z);
    spot.target.position.set(pos.x, 0.8, pos.z);
    spot.castShadow = true;
    spot.shadow.mapSize.width = 1024;
    spot.shadow.mapSize.height = 1024;
    spot.shadow.camera.near = 0.5;
    spot.shadow.camera.far = 12;
    spot.shadow.bias = -0.001;

    scene.add(spot);
    scene.add(spot.target);

    // Visible track spotlight fixture mesh
    const fixtureGeom = new THREE.CylinderGeometry(0.08, 0.12, 0.22, 16);
    const fixtureMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9, roughness: 0.2 });
    const fixture = new THREE.Mesh(fixtureGeom, fixtureMat);
    fixture.position.set(pos.x, 4.95, pos.z);
    scene.add(fixture);
  });
}
