export type ShopCategory = 'mind' | 'body' | 'sleep' | 'digital' | 'giftKit';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: ShopCategory;
  stock: number;
  rating: number;
  reviewCount: number;
  isTherapistRecommended: boolean;
  tags: string[];
}
