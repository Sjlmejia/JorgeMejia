import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { appConfig } from './app.config';
import { appRoutes } from './app.routes';
import { PRODUCT_REPOSITORY, ProductRepository } from './features/products/domain/repositories/product.repository';
import { ProductsHttpRepository } from './features/products/infrastructure/repositories/products-http.repository';

describe('appConfig', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [...appConfig.providers]
    });
  });

  it('registers application routes', () => {
    const router = TestBed.inject(Router);

    expect(router.config).toEqual(appRoutes);
  });

  it('registers ProductRepository implementation', () => {
    const repository = TestBed.inject(PRODUCT_REPOSITORY) as ProductRepository;

    expect(repository).toBeInstanceOf(ProductsHttpRepository);
  });
});
