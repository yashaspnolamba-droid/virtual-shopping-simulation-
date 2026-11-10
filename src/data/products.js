/**
 * Virtual Shopping Store - Product Catalog
 */

export const products = [
  {
    id: 'p-headphones',
    name: 'Aura Pro Studio Headphones',
    category: 'Acoustics & Audio',
    tagline: 'High-fidelity spatial audio with dual hybrid active noise cancellation.',
    price: 349.00,
    rating: 4.9,
    reviews: 142,
    sku: 'VEL-AUD-001',
    description: 'Precision engineered with 40mm custom beryllium dynamic drivers, ultra-soft memory foam protein leather earcups, and aerospace-grade anodized aluminum construction. Enjoy up to 45 hours of studio-grade acoustic performance on a single charge.',
    specs: [
      { label: 'Drivers', value: '40mm Beryllium Dome' },
      { label: 'Frequency', value: '10Hz – 45,000Hz' },
      { label: 'Battery Life', value: '45 hours (ANC On)' },
      { label: 'Connectivity', value: 'Bluetooth 5.4 / LDAC / 3.5mm' },
      { label: 'Weight', value: '254 grams' }
    ],
    colors: [
      { name: 'Matte Obsidian', hex: '#1c1c1e', primary: 0x1c1c1e, accent: 0xd4af37 },
      { name: 'Lunar Silver', hex: '#e2e8f0', primary: 0xd1d5db, accent: 0x38bdf8 },
      { name: 'Midnight Navy', hex: '#1e293b', primary: 0x0f172a, accent: 0x818cf8 }
    ],
    shelfPos: { x: -4.5, y: 1.15, z: -5.5 },
    modelType: 'headphones',
    badge: 'Best Seller'
  },
  {
    id: 'p-watch',
    name: 'Chronos Neo Titan Smartwatch',
    category: 'Smart Wearables',
    tagline: 'Aerospace Grade 5 titanium chassis with continuous biometric biosensing.',
    price: 429.00,
    rating: 4.8,
    reviews: 98,
    sku: 'VEL-WEAR-002',
    description: 'Forged from brushed Grade 5 titanium with a crystal sapphire lens. Features advanced optical PPG cardiac tracking, blood oxygenation monitoring, GPS multiband navigation, and a 100-meter water resistance rating.',
    specs: [
      { label: 'Display', value: '1.45" LTPO AMOLED 1000 nits' },
      { label: 'Material', value: 'Grade 5 Titanium & Sapphire' },
      { label: 'Battery', value: 'Up to 14 days standard use' },
      { label: 'Water Rating', value: '10 ATM (100m)' },
      { label: 'Sensors', value: 'ECG, SpO2, Skin Temp, Barometer' }
    ],
    colors: [
      { name: 'Brushed Titanium', hex: '#4b5563', primary: 0x4b5563, accent: 0xf59e0b },
      { name: 'Stealth Black', hex: '#18181b', primary: 0x18181b, accent: 0x10b981 },
      { name: 'Rose Titanium', hex: '#be808e', primary: 0xbe808e, accent: 0xffffff }
    ],
    shelfPos: { x: -4.5, y: 1.15, z: -1.5 },
    modelType: 'watch',
    badge: 'Editor’s Choice'
  },
  {
    id: 'p-keyboard',
    name: 'Keyverse Apex Mechanical Deck',
    category: 'Workspace Tech',
    tagline: 'Gasket-mounted CNC aluminum keyboard with tuned pre-lubed switches.',
    price: 189.00,
    rating: 4.9,
    reviews: 215,
    sku: 'VEL-TECH-003',
    description: 'An acoustic masterpiece tailored for tactile purists. Features a 6063 CNC milled solid aluminum chassis, flex-cut polycarbonate plate, hot-swappable sockets, and PBT dye-sublimated cherry-profile keycaps with RGB underglow diffusion.',
    specs: [
      { label: 'Layout', value: '75% Compact (82 Keys)' },
      { label: 'Mounting', value: 'Poron Multi-layer Gasket' },
      { label: 'Switches', value: 'Linear Crystal Matcha 45g' },
      { label: 'Polling Rate', value: '1000Hz Ultra-Low Latency' },
      { label: 'Connectivity', value: 'Tri-Mode: 2.4G, BT 5.2, USB-C' }
    ],
    colors: [
      { name: 'Cyber Smoke', hex: '#1f2937', primary: 0x1f2937, accent: 0x06b6d4 },
      { name: 'Chalk White', hex: '#f3f4f6', primary: 0xe5e7eb, accent: 0xf43f5e },
      { name: 'Deep Sage', hex: '#374151', primary: 0x334155, accent: 0xa3e635 }
    ],
    shelfPos: { x: -4.5, y: 1.15, z: 2.5 },
    modelType: 'keyboard',
    badge: 'Popular'
  },
  {
    id: 'p-camera',
    name: 'Lumix Vanguard Cinema Camera',
    category: 'Optics & Studio',
    tagline: '45MP full-frame cinema camera with 8K 60p internal RAW recording.',
    price: 1899.00,
    rating: 5.0,
    reviews: 64,
    sku: 'VEL-OPT-004',
    description: 'Crafted for visual storytellers demanding uncompromised clarity. Employs a back-illuminated full-frame sensor delivering 15+ stops of dynamic range, 5-axis IBIS stabilization, and active fan cooling for unlimited recording sessions.',
    specs: [
      { label: 'Sensor', value: '45.2 MP Full-Frame BSI CMOS' },
      { label: 'Video', value: '8K 60p / 4K 120p 12-Bit RAW' },
      { label: 'Stabilization', value: '5-Axis Sensor-Shift (7.5 Stops)' },
      { label: 'Card Slots', value: 'Dual CFexpress Type B & SD UHS-II' },
      { label: 'EVF', value: '5.76M-dot OLED 120fps' }
    ],
    colors: [
      { name: 'Magnesium Black', hex: '#111827', primary: 0x111827, accent: 0xef4444 },
      { name: 'Vintage Silver', hex: '#94a3b8', primary: 0x94a3b8, accent: 0xb91c1c }
    ],
    shelfPos: { x: 4.5, y: 1.15, z: -5.5 },
    modelType: 'camera',
    badge: 'Pro Tier'
  },
  {
    id: 'p-sneaker',
    name: 'Apex Quantum Kinetic Runner',
    category: 'Footwear & Lifestyle',
    tagline: 'Parametric 3D-lattice lattice propulsion sole with seamless breath-knit.',
    price: 229.00,
    rating: 4.7,
    reviews: 310,
    sku: 'VEL-LIFE-005',
    description: 'Revolutionary footwear driven by algorithmic performance. The 3D printed elastomeric lattice sole absorbs impact and recoils energy forward with a curved carbon-fiber composite footplate.',
    specs: [
      { label: 'Midsole', value: 'Parametric 3D Elastomer Lattice' },
      { label: 'Plate', value: '3D Contoured Full Carbon Fiber' },
      { label: 'Upper', value: 'Zero-Waste Recycled Monofilament' },
      { label: 'Outsole', value: 'Zonal High-Traction Rubber' },
      { label: 'Drop', value: '8mm Heel-to-Toe' }
    ],
    colors: [
      { name: 'Pure Phantom', hex: '#f8fafc', primary: 0xf1f5f9, accent: 0x22c55e },
      { name: 'Vortex Black', hex: '#18181b', primary: 0x18181b, accent: 0x06b6d4 },
      { name: 'Electric Ember', hex: '#ea580c', primary: 0xc2410c, accent: 0xffedd5 }
    ],
    shelfPos: { x: 4.5, y: 1.15, z: -1.5 },
    modelType: 'sneaker',
    badge: 'New Release'
  },
  {
    id: 'p-glasses',
    name: 'Spectra Vision AR Spectacles',
    category: 'Smart Wearables',
    tagline: 'Micro-OLED diffractive waveguide optics with contextual spatial AI.',
    price: 599.00,
    rating: 4.6,
    reviews: 79,
    sku: 'VEL-WEAR-006',
    description: 'Ultralight everyday smart glasses featuring dual 1080p micro-OLED optical waveguides. Displays unobtrusive turn-by-turn navigation, instant multi-language translation, and spatial audio with zero ear canal blockage.',
    specs: [
      { label: 'Optics', value: 'Dual 1080p Micro-OLED Waveguides' },
      { label: 'Brightness', value: 'Up to 3,000 nits outdoor peak' },
      { label: 'Weight', value: '68 grams featherweight' },
      { label: 'Speakers', value: 'Bespoke Dual Spatial Dipoles' },
      { label: 'Battery', value: 'All-Day with Pocket Power Case' }
    ],
    colors: [
      { name: 'Onyx Polish', hex: '#0f172a', primary: 0x0f172a, accent: 0x38bdf8 },
      { name: 'Tortoise Amber', hex: '#78350f', primary: 0x5a2d0c, accent: 0xf59e0b },
      { name: 'Brushed Gunmetal', hex: '#475569', primary: 0x475569, accent: 0x10b981 }
    ],
    shelfPos: { x: 4.5, y: 1.15, z: 2.5 },
    modelType: 'glasses',
    badge: 'AR Innovation'
  }
];

export function getProductById(id) {
  return products.find(p => p.id === id);
}

export function formatPrice(num) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(num);
}
