/**
 * QuackHost Pricing Configuration
 *
 * This file contains all pricing-related configuration.
 * Update values here to change pricing across the entire site.
 */

export interface PricingTier {
  id: string;
  name: string;
  ram: string;
  storage: string;
  basePrice: number | null; // null = custom pricing
  monthlyPrice: number | null;
  annualPrice: number | null; // Annual billing (save 15%)
  popular: boolean;
  features: string[];
  playerCount: string;
  useCase: string;
  recommended: boolean;
}

export interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number | null;
  unit: string; // "month", "GB", "each"
}

export interface DataCenter {
  id: string;
  name: string;
  location: string;
  city: string;
  country: string;
  coordinates: { lat: number; lng: number };
  status: 'live' | 'coming-soon' | 'planned';
  estimatedLaunch?: string;
  pingZones: {
    excellent: number; // <20ms radius
    good: number; // <50ms radius
    acceptable: number; // <100ms radius
  };
}

// ==================================================
// PRICING TIERS
// ==================================================
// Set prices to NULL for "Contact for pricing"
// Prices are in USD per month
// ==================================================

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    ram: '2GB',
    storage: '25GB',
    basePrice: null, // UPDATE: Set base price (e.g., 5.99)
    monthlyPrice: null,
    annualPrice: null, // AUTO-CALCULATED: basePrice * 12 * 0.85
    popular: false,
    recommended: false,
    playerCount: '1-10 players',
    useCase: 'Perfect for vanilla survival with friends',
    features: [
      'AngelDefence™ DDoS Protection',
      '2GB RAM',
      '25GB NVMe Storage',
      'Unlimited Bandwidth',
      'Automatic Backups (Daily)',
      'One-Click Mod Installer',
      'QuackPlane Control Panel',
      'Free Subdomain',
      '99.9% Uptime SLA',
      '24/7 Support',
    ],
  },
  {
    id: 'community',
    name: 'Community',
    ram: '4GB',
    storage: '50GB',
    basePrice: null, // UPDATE: Set base price (e.g., 12.99)
    monthlyPrice: null,
    annualPrice: null,
    popular: true,
    recommended: true,
    playerCount: '10-20 players',
    useCase: 'Small community server or light modpacks',
    features: [
      'AngelDefence™ DDoS Protection',
      '4GB RAM',
      '50GB NVMe Storage',
      'Unlimited Bandwidth',
      'Automatic Backups (Every 6 hours)',
      'One-Click Mod Installer',
      'QuackPlane Control Panel',
      'Free Subdomain',
      '99.9% Uptime SLA',
      'Priority Support',
      'MySQL Database Included',
    ],
  },
  {
    id: 'popular',
    name: 'Popular',
    ram: '8GB',
    storage: '100GB',
    basePrice: null, // UPDATE: Set base price (e.g., 24.99)
    monthlyPrice: null,
    annualPrice: null,
    popular: false,
    recommended: false,
    playerCount: '20-50 players',
    useCase: 'Growing community or modded gameplay',
    features: [
      'AngelDefence™ DDoS Protection',
      '8GB RAM',
      '100GB NVMe Storage',
      'Unlimited Bandwidth',
      'Automatic Backups (Every 3 hours)',
      'One-Click Mod Installer',
      'QuackPlane Control Panel',
      'Free Subdomain + Custom Domain',
      '99.9% Uptime SLA',
      'Priority Support',
      'MySQL Database Included',
      'Dedicated IPv4 Address',
    ],
  },
  {
    id: 'network',
    name: 'Network',
    ram: '16GB',
    storage: '200GB',
    basePrice: null, // UPDATE: Set base price (e.g., 49.99)
    monthlyPrice: null,
    annualPrice: null,
    popular: false,
    recommended: false,
    playerCount: '50-100 players',
    useCase: 'Large modded server or small network',
    features: [
      'AngelDefence™ DDoS Protection',
      '16GB RAM',
      '200GB NVMe Storage',
      'Unlimited Bandwidth',
      'Automatic Backups (Hourly)',
      'One-Click Mod Installer',
      'QuackPlane Control Panel',
      'Free Subdomain + Custom Domain',
      '99.95% Uptime SLA',
      'Premium Support (1hr response)',
      'MySQL Database Included',
      'Dedicated IPv4 Address',
      'Advanced Performance Tuning',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    ram: '32GB+',
    storage: '500GB+',
    basePrice: null, // Custom pricing only
    monthlyPrice: null,
    annualPrice: null,
    popular: false,
    recommended: false,
    playerCount: '100+ players',
    useCase: 'Major network or custom infrastructure',
    features: [
      'AngelDefence™ DDoS Protection',
      'Custom RAM Configuration',
      'Custom NVMe Storage',
      'Unlimited Bandwidth',
      'Continuous Backups',
      'One-Click Mod Installer',
      'QuackPlane Control Panel',
      'Custom Domain Setup',
      '99.99% Uptime SLA',
      'Dedicated Account Manager',
      'MySQL Database Cluster',
      'Multiple Dedicated IPs',
      'Advanced Performance Tuning',
      'Custom Server Configurations',
      'SLA Credits',
    ],
  },
];

// ==================================================
// ADD-ONS & EXTRAS
// ==================================================

export const ADD_ONS: AddOn[] = [
  {
    id: 'extra-backup-slots',
    name: 'Extra Backup Slots',
    description: 'Keep more backup history',
    price: null, // UPDATE: e.g., 2.99
    unit: '5 slots/month',
  },
  {
    id: 'extra-storage',
    name: 'Additional Storage',
    description: 'Expand your NVMe storage',
    price: null, // UPDATE: e.g., 0.50 per GB
    unit: 'per GB/month',
  },
  {
    id: 'dedicated-ip',
    name: 'Dedicated IPv4 Address',
    description: 'Your own permanent IP address',
    price: null, // UPDATE: e.g., 3.99
    unit: 'per IP/month',
  },
  {
    id: 'priority-support',
    name: 'Priority Support Upgrade',
    description: '<30min response time guarantee',
    price: null, // UPDATE: e.g., 9.99
    unit: 'per month',
  },
  {
    id: 'enterprise-ddos',
    name: 'Enterprise DDoS Protection',
    description: 'Enhanced AngelDefence with custom rules',
    price: null, // UPDATE: e.g., 19.99
    unit: 'per month',
  },
];

// ==================================================
// DATA CENTERS & LOCATIONS
// ==================================================

export const DATA_CENTERS: DataCenter[] = [
  {
    id: 'us-east',
    name: 'New York',
    location: 'US East',
    city: 'New York',
    country: 'United States',
    coordinates: { lat: 40.7128, lng: -74.0060 },
    status: 'coming-soon',
    estimatedLaunch: 'Q1 2025',
    pingZones: {
      excellent: 500, // km radius for <20ms
      good: 1500,
      acceptable: 3000,
    },
  },
  {
    id: 'eu-west',
    name: 'Amsterdam',
    location: 'EU West',
    city: 'Amsterdam',
    country: 'Netherlands',
    coordinates: { lat: 52.3676, lng: 4.9041 },
    status: 'coming-soon',
    estimatedLaunch: 'Q1 2025',
    pingZones: {
      excellent: 500,
      good: 1500,
      acceptable: 3000,
    },
  },
  {
    id: 'asia-southeast',
    name: 'Singapore',
    location: 'Asia Southeast',
    city: 'Singapore',
    country: 'Singapore',
    coordinates: { lat: 1.3521, lng: 103.8198 },
    status: 'planned',
    estimatedLaunch: 'Q2 2025',
    pingZones: {
      excellent: 500,
      good: 1500,
      acceptable: 3000,
    },
  },
];

// ==================================================
// RAM GUIDANCE & RECOMMENDATIONS
// ==================================================

export interface RAMGuidance {
  ram: string;
  players: string;
  useCase: string;
  description: string;
  examples: string[];
}

export const RAM_GUIDANCE: RAMGuidance[] = [
  {
    ram: '2GB',
    players: '1-10',
    useCase: 'Vanilla Survival',
    description: 'Perfect for playing with a small group of friends in vanilla Minecraft',
    examples: [
      'Private survival server',
      'Small creative world',
      'Testing configurations',
    ],
  },
  {
    ram: '4GB',
    players: '10-20',
    useCase: 'Small Community',
    description: 'Great for small communities or servers with lightweight plugins',
    examples: [
      'Small SMP server',
      'Vanilla+ with essential plugins',
      'Private modded server (FTB Lite)',
    ],
  },
  {
    ram: '6GB',
    players: '15-30',
    useCase: 'Active Community',
    description: 'Ideal for active communities with moderate plugin usage',
    examples: [
      'Medium SMP with plugins',
      'Skyblock server',
      'Light modpack (20-50 mods)',
    ],
  },
  {
    ram: '8GB',
    players: '20-50',
    useCase: 'Popular Server',
    description: 'Handles popular servers with many plugins or medium modpacks',
    examples: [
      'Popular SMP server',
      'Medium modpack (50-100 mods)',
      'Mini-game server',
      'Survival with economy plugins',
    ],
  },
  {
    ram: '12GB',
    players: '40-70',
    useCase: 'Large Community',
    description: 'Powers large communities with extensive plugins or heavy modpacks',
    examples: [
      'Large SMP network',
      'Heavy modpack (100-150 mods)',
      'Multiple mini-games',
      'Towny/Factions server',
    ],
  },
  {
    ram: '16GB',
    players: '50-100',
    useCase: 'Large Modded',
    description: 'Designed for large modded servers or small server networks',
    examples: [
      'Very heavy modpack (150+ mods)',
      'Small BungeeCord network',
      'Large faction server',
      'Complex mini-game network',
    ],
  },
  {
    ram: '24GB',
    players: '75-150',
    useCase: 'Network Hub',
    description: 'Enterprise-grade hosting for server networks and major communities',
    examples: [
      'BungeeCord/Velocity network',
      'Massive modpack servers',
      'Multiple simultaneous game modes',
    ],
  },
  {
    ram: '32GB',
    players: '100+',
    useCase: 'Major Network',
    description: 'Maximum performance for the largest networks and communities',
    examples: [
      'Major server network',
      'Multiple high-player servers',
      'Custom game modes with high demand',
    ],
  },
];

// ==================================================
// STORAGE GUIDANCE
// ==================================================

export interface StorageGuidance {
  storage: string;
  description: string;
  holds: string[];
}

export const STORAGE_GUIDANCE: StorageGuidance[] = [
  {
    storage: '25GB',
    description: 'Enough for small worlds and basic plugins',
    holds: [
      '2-3 world saves',
      '10-15 backups',
      'Essential plugins',
      'Basic logs',
    ],
  },
  {
    storage: '50GB',
    description: 'Room for multiple worlds and mod storage',
    holds: [
      '5-7 world saves',
      '20-30 backups',
      'Moderate plugin collection',
      'Extended logs',
    ],
  },
  {
    storage: '100GB',
    description: 'Plenty of space for modpacks and extensive backups',
    holds: [
      '10+ world saves',
      '40-50 backups',
      'Large plugin/mod collection',
      'Full logging history',
    ],
  },
  {
    storage: '200GB',
    description: 'Large storage for networks and heavy modpacks',
    holds: [
      '20+ world saves',
      '100+ backups',
      'Extensive mod libraries',
      'Complete audit logs',
    ],
  },
  {
    storage: '500GB+',
    description: 'Enterprise storage for major networks',
    holds: [
      'Unlimited world saves',
      'Extensive backup retention',
      'Full mod repositories',
      'Long-term log storage',
    ],
  },
];

// ==================================================
// DISCOUNT STRUCTURE
// ==================================================

export const DISCOUNTS = {
  annual: 0.15, // 15% off annual billing
  quarterly: 0.05, // 5% off quarterly billing
  semiannual: 0.10, // 10% off semi-annual billing
  multiServer3Plus: 0.10, // 10% off for 3+ servers
  multiServer5Plus: 0.20, // 20% off for 5+ servers
  earlyAdopter: 0.20, // 20% off for early adopters (launch promo)
};

// ==================================================
// LAUNCH CONFIGURATION
// ==================================================

export const LAUNCH_CONFIG = {
  status: 'pre-launch', // 'pre-launch' | 'launching' | 'live'
  launchDate: 'Q1 2025', // UPDATE: Actual launch date
  earlyAccessAvailable: true,
  waitlistEnabled: true,
  priceLockGuarantee: true, // Early adopters lock in launch pricing
  setupFee: 0, // Always $0
  freeTrial: {
    enabled: true,
    days: 7,
    creditCardRequired: false,
  },
};

// ==================================================
// BRAND MESSAGING
// ==================================================

export const ANGEL_DEFENCE = {
  tagline: 'DDoS protection that never sleeps',
  subTagline: 'Your server stays online when others don\'t',
  description: 'Network-level protection that stops attacks before they reach your server',
  keyPoints: [
    'Always-on protection included with every plan',
    'Stops attacks at the network edge',
    'No performance impact on your server',
    'Technical issues can happen - DDoS attacks won\'t',
  ],
  technicalDetails: [
    'Multi-gigabit scrubbing capacity',
    'Layer 3, 4, and 7 protection',
    'Real-time threat intelligence',
    'Automatic mitigation',
    'Zero-configuration required',
  ],
};

// ==================================================
// HELPER FUNCTIONS
// ==================================================

/**
 * Calculate annual price with discount
 */
export function calculateAnnualPrice(monthlyPrice: number): number {
  return Math.round(monthlyPrice * 12 * (1 - DISCOUNTS.annual) * 100) / 100;
}

/**
 * Calculate savings from annual billing
 */
export function calculateAnnualSavings(monthlyPrice: number): number {
  const monthlyTotal = monthlyPrice * 12;
  const annualPrice = calculateAnnualPrice(monthlyPrice);
  return Math.round((monthlyTotal - annualPrice) * 100) / 100;
}

/**
 * Get recommended RAM for player count
 */
export function getRecommendedRAM(playerCount: number): RAMGuidance | null {
  for (const guide of RAM_GUIDANCE) {
    const [min, max] = guide.players.split('-').map(p => parseInt(p.replace('+', '')));
    if (playerCount >= min && (max ? playerCount <= max : true)) {
      return guide;
    }
  }
  return RAM_GUIDANCE[RAM_GUIDANCE.length - 1]; // Return highest tier
}

/**
 * Format price for display
 */
export function formatPrice(price: number | null): string {
  if (price === null) return 'Custom';
  return `$${price.toFixed(2)}`;
}

/**
 * Get nearest data center (placeholder - requires geolocation)
 */
export function getNearestDataCenter(): DataCenter {
  // TODO: Implement actual geolocation logic
  return DATA_CENTERS[0]; // Default to first
}
