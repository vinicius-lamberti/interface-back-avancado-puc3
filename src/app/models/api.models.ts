// FakeStoreAPI schemas (documented contract + compatibility with the real backend payloads)
export interface ProductRating {
  rate: number;
  count: number;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: ProductRating;
  __v?: number;
}

export interface CartItem {
  id?: number;
  productId: number;
  quantity: number;
}

export interface Cart {
  id: number;
  userId: number;
  date?: string;
  products: CartItem[];
  __v?: number;
}

export interface UserName {
  firstname: string;
  lastname: string;
}

export interface UserGeoLocation {
  lat: string;
  long: string;
}

export interface UserAddress {
  city: string;
  street: string;
  number: number;
  zipcode: string;
  geolocation?: UserGeoLocation;
}

export interface User {
  id: number;
  username: string;
  email: string;
  password?: string;
  name?: UserName;
  address?: UserAddress;
  phone?: string;
  __v?: number;
}

export interface LoginRequest {
  username: string;
  password: string;
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

// SQLite order schemas
export interface OrderItem {
  id?: number;
  order_id?: number;
  product_id: number;
  quantity: number;
  price_at_purchase: number;
  unit_price?: number;
  created_at?: string;
}

export interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  created_at: string;
  updated_at?: string;
  items: OrderItem[];
}
