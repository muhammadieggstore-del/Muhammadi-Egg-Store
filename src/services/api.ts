import { Product, StoreSettings } from '../types';

// Standard high-quality mock data for Muhammadi Egg Store items
const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Fresh White Eggs (Tray)',
    tagline: 'Direct-from-farm 100% white eggs',
    description: 'Fresh wholesale white eggs. High quality, reliable supply, zero tension. Minimum supply: 50 egg trays across Loni, Ghaziabad.',
    category: 'Eggs',
    price: 180, // Example bulk price per tray
    unit: 'Tray',
    image: 'https://unsplash.com',
    stockStatus: 'in_stock',
    stockQuantity: 500,
    isPromotional: true,
    variants: [
      { id: 'v1-1', name: '50 Trays (Bulk)', quantityLabel: '50 Trays', price: 9000 },
      { id: 'v1-2', name: '100 Trays (Wholesale)', quantityLabel: '100 Trays', price: 18000 }
    ]
  },
  {
    id: 'prod-2',
    name: 'Britannia White Bread',
    tagline: 'Medium Pack Fresh Bread',
    description: 'Fresh Britannia white bread packs. Minimum wholesale delivery requirement: 25 pieces.',
    category: 'Bakery',
    price: 30,
    unit: 'Piece',
    image: 'https://unsplash.com',
    stockStatus: 'in_stock',
    stockQuantity: 200,
    variants: [
      { id: 'v2-1', name: '25 Pieces Pack', quantityLabel: '25 Pcs', price: 750 }
    ]
  },
  {
    id: 'prod-3',
    name: 'Regular Buns',
    tagline: '2-Pack Transparent Wrap',
    description: 'Standard fresh regular buns in clean transparent double-packaging. Minimum wholesale delivery requirement: 25 packs.',
    category: 'Bakery',
    price: 15,
    unit: 'Pack',
    image: 'https://unsplash.com',
    stockStatus: 'in_stock',
    stockQuantity: 300,
    variants: [
      { id: 'v3-1', name: '25 Packs Bundle', quantityLabel: '25 Packs', price: 375 }
    ]
  }
];

const MOCK_SETTINGS: StoreSettings = {
  storeName: 'Muhammadi Egg Store',
  minOrderEggs: 50,
  minOrderBakery: 25,
  isAcceptingOrders: true,
  deliveryAreas: ['Loni', 'Ghaziabad']
};

export const fetchProducts = async (): Promise<Product[]> => {
  // Simulates quick API fetch delay
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_PRODUCTS), 100);
  });
};

export const fetchSettings = async (): Promise<StoreSettings> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_SETTINGS), 100);
  });
};
