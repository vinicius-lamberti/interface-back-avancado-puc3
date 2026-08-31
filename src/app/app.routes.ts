import { Routes } from '@angular/router';
import { CartComponent } from './features/cart/cart.component';
import { HomeComponent } from './features/home/home.component';
import { ProductComponent } from './features/product/product.component';
import { ProfileComponent } from './features/profile/profile.component';
import { SuccessComponent } from './features/checkout/success.component';
import { WishlistComponent } from './features/wishlist/wishlist.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'product/:id', component: ProductComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'wishlist/:id', component: WishlistComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout/success', component: SuccessComponent },
  { path: '**', redirectTo: '' },
];
