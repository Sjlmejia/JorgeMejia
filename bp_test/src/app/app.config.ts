import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { appRoutes } from './app.routes';
import { apiErrorInterceptor } from './core/interceptors/api-error.interceptor';
import { PRODUCT_REPOSITORY } from './features/products/domain/repositories/product.repository';
import { ProductsHttpRepository } from './features/products/infrastructure/repositories/products-http.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(withInterceptors([apiErrorInterceptor])),
    { provide: PRODUCT_REPOSITORY, useClass: ProductsHttpRepository }
  ]
};
