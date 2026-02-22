import { Product } from './product';

export type ShopOrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ShopOrder {
  orderId: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  createdAt: string;
  status: ShopOrderStatus;
}
