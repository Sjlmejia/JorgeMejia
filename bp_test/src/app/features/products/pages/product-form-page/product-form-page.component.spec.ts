import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ProductsFacade } from '../../application/products.facade';
import { Product } from '../../domain/entities/product.entity';
import { ProductFormPageComponent } from './product-form-page.component';

describe('ProductFormPageComponent', () => {
  let component: ProductFormPageComponent;
  let productsFacade: jest.Mocked<Pick<ProductsFacade, 'getProductById' | 'createProduct' | 'updateProduct'>>;
  let router: jest.Mocked<Pick<Router, 'navigate'>>;

  const product: Product = {
    id: 'p-001',
    name: 'Cuenta Ahorro',
    description: 'Producto de ahorro personal',
    logo: 'https://example.com/a.png',
    date_release: '2026-01-01',
    date_revision: '2027-01-01'
  };

  const setup = (id: string | null = null): void => {
    productsFacade = {
      getProductById: jest.fn(),
      createProduct: jest.fn(),
      updateProduct: jest.fn()
    };
    router = { navigate: jest.fn() };

    TestBed.overrideComponent(ProductFormPageComponent, {
      set: { template: '' }
    });

    TestBed.configureTestingModule({
      imports: [ProductFormPageComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap(id ? { id } : {})
            }
          }
        },
        { provide: Router, useValue: router },
        { provide: ProductsFacade, useValue: productsFacade }
      ]
    });

    const fixture = TestBed.createComponent(ProductFormPageComponent);
    component = fixture.componentInstance;
  };

  it('does not load product when id param is missing', () => {
    setup(null);

    component.ngOnInit();

    expect(component.editing()).toBe(false);
    expect(productsFacade.getProductById).not.toHaveBeenCalled();
  });

  it('loads product when id exists', () => {
    setup(product.id);
    productsFacade.getProductById.mockReturnValue(of(product));

    component.ngOnInit();

    expect(component.editing()).toBe(true);
    expect(productsFacade.getProductById).toHaveBeenCalledWith(product.id);
    expect(component.product()).toEqual(product);
    expect(component.loading()).toBe(false);
  });

  it('handles product loading error', () => {
    setup(product.id);
    productsFacade.getProductById.mockReturnValue(throwError(() => new Error('Load error')));

    component.ngOnInit();

    expect(component.errorMessage()).toBe('Load error');
    expect(component.loading()).toBe(false);
  });

  it('creates product when not editing', () => {
    setup(null);
    productsFacade.createProduct.mockReturnValue(of({ message: 'created', data: product }));

    component.onSave(product);

    expect(productsFacade.createProduct).toHaveBeenCalledWith(product);
    expect(productsFacade.updateProduct).not.toHaveBeenCalled();
    expect(component.submitting()).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/products']);
  });

  it('updates product when editing', () => {
    setup(product.id);
    productsFacade.getProductById.mockReturnValue(of(product));
    productsFacade.updateProduct.mockReturnValue(of({ message: 'updated', data: product }));
    component.ngOnInit();

    component.onSave(product);

    expect(productsFacade.updateProduct).toHaveBeenCalledWith(product.id, product);
    expect(productsFacade.createProduct).not.toHaveBeenCalled();
    expect(component.submitting()).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/products']);
  });

  it('handles save error and keeps user on page', () => {
    setup(null);
    productsFacade.createProduct.mockReturnValue(throwError(() => new Error('Save error')));

    component.onSave(product);

    expect(component.errorMessage()).toBe('Save error');
    expect(component.submitting()).toBe(false);
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
