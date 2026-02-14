import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ProductsFacade } from './products.facade';
import { PRODUCT_REPOSITORY, ProductRepository } from '../domain/repositories/product.repository';
import { Product } from '../domain/entities/product.entity';

describe('ProductsFacade', () => {
  let facade: ProductsFacade;
  let repository: jest.Mocked<ProductRepository>;

  const product: Product = {
    id: 'p-001',
    name: 'Producto Demo',
    description: 'Descripcion del producto demo',
    logo: 'https://example.com/logo.png',
    date_release: '2026-01-01',
    date_revision: '2027-01-01'
  };

  beforeEach(() => {
    repository = {
      getProducts: jest.fn(),
      getProductById: jest.fn(),
      verifyId: jest.fn(),
      createProduct: jest.fn(),
      updateProduct: jest.fn(),
      deleteProduct: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        ProductsFacade,
        { provide: PRODUCT_REPOSITORY, useValue: repository }
      ]
    });

    facade = TestBed.inject(ProductsFacade);
  });

  it('delegates getProducts to repository', (done) => {
    repository.getProducts.mockReturnValue(of([product]));

    facade.getProducts().subscribe((result) => {
      expect(result).toEqual([product]);
      expect(repository.getProducts).toHaveBeenCalled();
      done();
    });
  });

  it('delegates getProductById to repository', (done) => {
    repository.getProductById.mockReturnValue(of(product));

    facade.getProductById(product.id).subscribe((result) => {
      expect(result).toEqual(product);
      expect(repository.getProductById).toHaveBeenCalledWith(product.id);
      done();
    });
  });

  it('delegates verifyId to repository', (done) => {
    repository.verifyId.mockReturnValue(of(true));

    facade.verifyId(product.id).subscribe((result) => {
      expect(result).toBe(true);
      expect(repository.verifyId).toHaveBeenCalledWith(product.id);
      done();
    });
  });

  it('delegates createProduct to repository', (done) => {
    const response = { message: 'created', data: product };
    repository.createProduct.mockReturnValue(of(response));

    facade.createProduct(product).subscribe((result) => {
      expect(result).toEqual(response);
      expect(repository.createProduct).toHaveBeenCalledWith(product);
      done();
    });
  });

  it('delegates updateProduct to repository', (done) => {
    const patch = { name: 'Producto Actualizado' };
    const response = { message: 'updated' };
    repository.updateProduct.mockReturnValue(of(response));

    facade.updateProduct(product.id, patch).subscribe((result) => {
      expect(result).toEqual(response);
      expect(repository.updateProduct).toHaveBeenCalledWith(product.id, patch);
      done();
    });
  });

  it('delegates deleteProduct to repository', (done) => {
    const response = { message: 'deleted' };
    repository.deleteProduct.mockReturnValue(of(response));

    facade.deleteProduct(product.id).subscribe((result) => {
      expect(result).toEqual(response);
      expect(repository.deleteProduct).toHaveBeenCalledWith(product.id);
      done();
    });
  });
});
