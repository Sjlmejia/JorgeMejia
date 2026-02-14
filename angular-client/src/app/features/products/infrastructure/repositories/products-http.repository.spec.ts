import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../../../../environments/environment';
import { Product } from '../../domain/entities/product.entity';
import { ProductsHttpRepository } from './products-http.repository';

describe('ProductsHttpRepository', () => {
  let repository: ProductsHttpRepository;
  let httpController: HttpTestingController;

  const baseEndpoint = `${environment.apiBaseUrl}/products`;
  const product: Product = {
    id: 'p-001',
    name: 'Producto Demo',
    description: 'Descripcion del producto demo',
    logo: 'https://example.com/logo.png',
    date_release: '2026-01-01',
    date_revision: '2027-01-01'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductsHttpRepository,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    repository = TestBed.inject(ProductsHttpRepository);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('gets products from API and maps response.data', (done) => {
    repository.getProducts().subscribe((products) => {
      expect(products).toEqual([product]);
      done();
    });

    const req = httpController.expectOne(baseEndpoint);
    expect(req.request.method).toBe('GET');
    req.flush({ data: [product] });
  });

  it('gets a single product by id', (done) => {
    repository.getProductById(product.id).subscribe((result) => {
      expect(result).toEqual(product);
      done();
    });

    const req = httpController.expectOne(`${baseEndpoint}/${product.id}`);
    expect(req.request.method).toBe('GET');
    req.flush(product);
  });

  it('verifies product id', (done) => {
    repository.verifyId(product.id).subscribe((exists) => {
      expect(exists).toBe(true);
      done();
    });

    const req = httpController.expectOne(`${baseEndpoint}/verification/${product.id}`);
    expect(req.request.method).toBe('GET');
    req.flush(true);
  });

  it('creates a product', (done) => {
    const response = { message: 'created', data: product };

    repository.createProduct(product).subscribe((result) => {
      expect(result).toEqual(response);
      done();
    });

    const req = httpController.expectOne(baseEndpoint);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(product);
    req.flush(response);
  });

  it('updates a product', (done) => {
    const patch = { name: 'Nuevo Nombre' };
    const response = { message: 'updated' };

    repository.updateProduct(product.id, patch).subscribe((result) => {
      expect(result).toEqual(response);
      done();
    });

    const req = httpController.expectOne(`${baseEndpoint}/${product.id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(patch);
    req.flush(response);
  });

  it('deletes a product', (done) => {
    const response = { message: 'deleted' };

    repository.deleteProduct(product.id).subscribe((result) => {
      expect(result).toEqual(response);
      done();
    });

    const req = httpController.expectOne(`${baseEndpoint}/${product.id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(response);
  });
});
