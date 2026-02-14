import { appRoutes } from './app.routes';
import { ProductFormPageComponent } from './features/products/pages/product-form-page/product-form-page.component';
import { ProductsPageComponent } from './features/products/pages/products-page/products-page.component';

describe('appRoutes', () => {
  it('defines default and wildcard redirects to products', () => {
    expect(appRoutes[0]).toEqual({ path: '', pathMatch: 'full', redirectTo: 'products' });
    expect(appRoutes[4]).toEqual({ path: '**', redirectTo: 'products' });
  });

  it('defines products list route', () => {
    expect(appRoutes[1]).toEqual({ path: 'products', component: ProductsPageComponent });
  });

  it('defines product form routes for create and edit', () => {
    expect(appRoutes[2]).toEqual({ path: 'products/new', component: ProductFormPageComponent });
    expect(appRoutes[3]).toEqual({ path: 'products/:id/edit', component: ProductFormPageComponent });
  });
});
