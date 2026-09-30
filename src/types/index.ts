export type Category = 'Eggs' | 'Bakery';

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface ProductVariant {
  id: string;
  name: string;
  quantityLabel: string;
  price: number;
  isDefault?: boolean;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: Category;
  unit: string;
  price: number;
  image: string;
  stockStatus: StockStatus;
  stockQuantity: number;
  minOrderQuantity: number;
  isActive: boolean;
  isPromotional?: boolean;
  variants: ProductVariant[];
}

export interface CartItem {
  id: string; // Unique cart item key (e.g. `${productId}-${variantId}`)
  productId: string;
  variantId?: string;
  productName: string;
  variantName?: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  image: string;
  unit: string;
}

export type OrderStatus =
  | 'Order Received'
  | 'Confirmed'
  | 'Preparing'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export interface OrderTimelineItem {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  whatsapp: string;
}

export interface DeliveryInfo {
  address: string;
  locality: string;
  landmark?: string;
  instructions?: string;
}

export interface Order {
  id: string;
  createdAt: string;
  customer: CustomerInfo;
  delivery: DeliveryInfo;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: 'cod' | 'upi_on_delivery';
  status: OrderStatus;
  timeline: OrderTimelineItem[];
  notes?: string;
}

export type BulkInquiryStatus =
  | 'New'
  | 'Contacted'
  | 'Quoted'
  | 'Confirmed'
  | 'Completed'
  | 'Cancelled';

export interface BulkOrderInquiry {
  id: string;
  createdAt: string;
  customerName: string;
  businessName: string;
  businessType: string;
  phone: string;
  whatsapp: string;
  requiredProduct: string;
  requiredQuantity: string;
  preferredDate: string;
  deliveryLocation: string;
  frequency: string;
  additionalRequirements?: string;
  status: BulkInquiryStatus;
}

export interface CustomerRecord {
  phone: string;
  name: string;
  whatsapp: string;
  address: string;
  totalOrders: number;
  totalSpend: number;
  lastOrderAt: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  phone: string;
  whatsappNumber: string;
  serviceArea: string;
  supportedLocalities: string[];
  isOpen: boolean;
  openHours: string;
  deliveryFee: number;
  minOrderAmount: number;
  adminPin?: string;
}

export interface AdminMetrics {
  todayOrdersCount: number;
  pendingOrdersCount: number;
  outForDeliveryCount: number;
  completedOrdersCount: number;
  todaySales: number;
  lowStockCount: number;
  bulkInquiriesCount: number;
  totalProductsCount: number;
  totalOrdersCount: number;
}
