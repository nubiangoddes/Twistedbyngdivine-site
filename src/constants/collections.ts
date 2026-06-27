import type { Collection, TwistOption, ShippingRate, ColorSwatch } from '@/types';
import winedCandyImg from '@/assets/wined-candy.png';
import saltWaterTaffyImg from '@/assets/salt-water-taffy.png';
import twizzlersImg from '@/assets/twizzlers.png';

export const TWIST_OPTIONS: TwistOption[] = [
  { id: 'signature', name: 'Signature Twist', size: '2"', price: 15 },
  { id: 'bow', name: 'Bow Twist', size: '3"', price: 20 },
  { id: 'main-character', name: 'Main Character Twist', size: '4"', price: 25 },
];

// Color swatches keyed by colorStory id — official Twisted by NG Divine colorways
export const COLOR_SWATCHES: Record<string, ColorSwatch> = {
  // Wined Candy
  'classic-wined-candy':    { primary: '#C41E1E', secondary: '#F0C030', label: 'Classic Wined Candy' },   // Red + Yellow
  'blueberry-razz':         { primary: '#1E55CC', secondary: '#E8387A', label: 'Blueberry Razz' },         // Blue + Raspberry Pink
  'melon-fizz':             { primary: '#FFB3C6', secondary: '#AAFF00', label: 'Melon Fizz' },              // Soft Pink + Lime Green
  // Salt Water Taffy
  'lemon-drop':             { primary: '#F5E07A', secondary: '#EDD440', label: 'Lemon Drop' },              // Soft Yellow
  'vanilla-swirl':          { primary: '#F5ECD9', secondary: '#C8A870', label: 'Vanilla Swirl' },           // Creamy Vanilla + Light Caramel
  'caramel-kiss':           { primary: '#9E6030', secondary: '#C88040', label: 'Caramel Kiss' },            // Warm Caramel Brown
  // Twizzlers
  'licorice-black':         { primary: '#1A1A1A', secondary: '#444444', label: 'Licorice Black' },          // Solid Black
  'baby-blue-cotton-candy': { primary: '#A8D8F0', secondary: '#D0EEFB', label: 'Baby Blue Cotton Candy' }, // Soft Powder Blue
  'bubblegum-pink':         { primary: '#FF4FA3', secondary: '#FF85C0', label: 'Bubblegum Pink' },          // Bright Bubblegum Pink
  'electric-grape':         { primary: '#7B10B0', secondary: '#BF00FF', label: 'Electric Grape' },          // Rich Electric Purple
};

export const COLLECTIONS: Collection[] = [
  {
    id: '1',
    slug: 'wined-candy',
    number: 'N°01',
    name: 'WINED CANDY',
    tagline: 'Bold. Juicy. Unforgettable.',
    description:
      'Inspired by the deep, rich hues of wine-stained candy, this collection is for the woman who commands attention without saying a word. Bold, juicy, and completely unforgettable — Wined Candy earrings are the statement your wardrobe has been waiting for.',
    colorStories: [
      { id: 'classic-wined-candy', name: 'Classic Wined Candy' },
      { id: 'blueberry-razz', name: 'Blueberry Razz' },
      { id: 'melon-fizz', name: 'Melon Fizz' },
    ],
    image: winedCandyImg,
    accentColor: '#C41E3A',
    bgGradient: 'from-[#3d0015] to-[#7a1035]',
    textColor: '#FFB3C1',
  },
  {
    id: '2',
    slug: 'salt-water-taffy',
    number: 'N°02',
    name: 'SALT WATER TAFFY',
    tagline: 'Sweet. Soft. Sophisticated.',
    description:
      'Soft as a sea breeze, sweet as the candy that inspired it. Salt Water Taffy earrings blend pastel perfection with hand-braided craftsmanship. These pairs are for the girl who is gentle but never forgettable — sophisticated sweetness in every strand.',
    colorStories: [
      { id: 'lemon-drop', name: 'Lemon Drop' },
      { id: 'vanilla-swirl', name: 'Vanilla Swirl' },
      { id: 'caramel-kiss', name: 'Caramel Kiss' },
    ],
    image: saltWaterTaffyImg,
    accentColor: '#FF9FCF',
    bgGradient: 'from-[#3d2060] to-[#7a3090]',
    textColor: '#FFE4F0',
  },
  {
    id: '3',
    slug: 'twizzlers',
    number: 'N°03',
    name: 'TWIZZLERS',
    tagline: 'Loud. Playful. Unapologetic.',
    description:
      'Zero apologies. Maximum impact. Twizzlers earrings were made for the woman who walks into the room and owns it. Bright, bold, and playfully loud — this collection celebrates the art of being exactly who you are, unapologetically.',
    colorStories: [
      { id: 'licorice-black', name: 'Licorice Black' },
      { id: 'baby-blue-cotton-candy', name: 'Baby Blue Cotton Candy' },
      { id: 'bubblegum-pink', name: 'Bubblegum Pink' },
      { id: 'electric-grape', name: 'Electric Grape' },
    ],
    image: twizzlersImg,
    accentColor: '#BF00FF',
    bgGradient: 'from-[#00204d] to-[#0040a0]',
    textColor: '#E0B3FF',
  },
];

export const SHIPPING_RATES: ShippingRate[] = [
  { country: 'United States', code: 'US', rate: 8.99, days: '3–5 business days' },
  { country: 'Canada', code: 'CA', rate: 15.99, days: '7–10 business days' },
  { country: 'United Kingdom', code: 'GB', rate: 18.99, days: '7–14 business days' },
  { country: 'Australia', code: 'AU', rate: 22.99, days: '10–14 business days' },
];

export const PROMO_CODES: Record<string, { discount: number; label: string }> = {
  TWISTED15: { discount: 0.15, label: '15% off' },
};
