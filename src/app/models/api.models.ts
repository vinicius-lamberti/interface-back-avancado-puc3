// FakeStoreAPI schemas
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

export interface CartItem {
  productId: number;
  quantity: number;
}

export interface Cart {
  id: number;
  userId: number;
  date?: string;
  products: CartItem[];
}

export interface User {
  id: number;
  username: string;
  email: string;
  password?: string;
  name?: {
    firstname: string;
    lastname: string;
  };
  address?: {
    city: string;
    street: string;
    number: number;
    zipcode: string;
    geolocation?: {
      lat: string;
      long: string;
    };
  };
  phone?: string;
}

export interface AuthLoginResponse {
  token: string;
}

// SQLite wishlist schemas
export interface WishlistItem {
  id: number;
  wishlist_id: number;
  product_id: number;
  added_at?: string;
}

export interface Wishlist {
  id: number;
  user_id: number;
  name: string;
  created_at?: string;
  items?: WishlistItem[];
}
