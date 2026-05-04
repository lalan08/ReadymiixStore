export interface ProductImage {
  url: string;
  alt?: string;
}

export interface CartItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  quantity: number;
  volume?: string;
  options?: {
    sirop?: string;
    soft?: string;
  };
}

export interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  total: () => number;
  itemCount: () => number;
}

export interface ProductWithCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  comparePrice: number | null;
  images: string;
  stock: number;
  featured: boolean;
  active: boolean;
  volume: string | null;
  alcohol: string | null;
  tags: string;
  categoryId: string;
  category: { id: string; name: string; slug: string };
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  postalCode: string;
  notes: string;
  paymentMethod: string;
  items: CartItem[];
}
