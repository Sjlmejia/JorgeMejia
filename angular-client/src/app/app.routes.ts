import { Routes } from '@angular/router';
import { ProductsPageComponent } from './features/products/pages/products-page/products-page.component';
import { ProductFormPageComponent } from './features/products/pages/product-form-page/product-form-page.component';

export const appRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'products' },
  { path: 'products', component: ProductsPageComponent },
  { path: 'products/new', component: ProductFormPageComponent },
  { path: 'products/:id/edit', component: ProductFormPageComponent },
  { path: '**', redirectTo: 'products' }
];
