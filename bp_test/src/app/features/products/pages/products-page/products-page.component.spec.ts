import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ProductsFacade } from '../../application/products.facade';
import { Product } from '../../domain/entities/product.entity';
import { ProductsPageComponent } from './products-page.component';

describe('ProductsPageComponent', () => {
  let component: ProductsPageComponent;
  let productsFacade: jest.Mocked<Pick<ProductsFacade, 'getProducts'>>;
  let router: jest.Mocked<Pick<Router, 'navigate'>>;

  const products: Product[] = [
    {
      id: 'p-001',
      name: 'Cuenta Ahorro',
      description: 'Producto de ahorro personal',
      logo: 'https://example.com/a.png',
      date_release: '2026-01-01',
      date_revision: '2027-01-01'
    },
    {
      id: 'p-002',
      name: 'Cuenta Corriente',
      description: 'Producto para empresas',
      logo: 'https://example.com/b.png',
      date_release: '2026-02-01',
      date_revision: '2027-02-01'
    }
  ];

  beforeEach(() => {
    productsFacade = { getProducts: jest.fn() };
    router = { navigate: jest.fn() };

    TestBed.overrideComponent(ProductsPageComponent, {
      set: { template: '' }
    });

    TestBed.configureTestingModule({
      imports: [ProductsPageComponent],
      providers: [
        { provide: ProductsFacade, useValue: productsFacade },
        { provide: Router, useValue: router }
      ]
    });

    const fixture = TestBed.createComponent(ProductsPageComponent);
    component = fixture.componentInstance;
  });

  it('loads products on init', () => {
    productsFacade.getProducts.mockReturnValue(of(products));

    component.ngOnInit();

    expect(productsFacade.getProducts).toHaveBeenCalled();
    expect(component.products()).toEqual(products);
    expect(component.currentPage()).toBe(1);
    expect(component.loading()).toBe(false);
  });

  it('handles API error while loading products', () => {
    productsFacade.getProducts.mockReturnValue(throwError(() => new Error('Fallo API')));

    component.loadProducts();

    expect(component.errorMessage()).toBe('Fallo API');
    expect(component.loading()).toBe(false);
  });

  it('returns all products when search term is empty', () => {
    component.products.set(products);
    component.searchTerm.set('   ');

    expect(component.filteredProducts()).toEqual(products);
  });

  it('filters products by id/name/description with case insensitivity', () => {
    component.products.set(products);
    component.searchTerm.set('empresa');

    expect(component.filteredProducts()).toEqual([products[1]]);
  });

  it('computes total pages and paginated products', () => {
    component.products.set(products);
    component.pageSize.set(1);
    component.currentPage.set(2);

    expect(component.totalPages()).toBe(2);
    expect(component.paginatedProducts()).toEqual([products[1]]);
  });

  it('resets to first page on search/page size changes', () => {
    component.currentPage.set(3);

    component.onSearchChange('abc');
    expect(component.currentPage()).toBe(1);

    component.currentPage.set(4);
    component.onPageSizeChange(10);
    expect(component.pageSize()).toBe(10);
    expect(component.currentPage()).toBe(1);
  });

  it('moves between pages with boundaries', () => {
    component.products.set(products);
    component.pageSize.set(1);
    component.currentPage.set(2);

    component.previousPage();
    expect(component.currentPage()).toBe(1);

    component.previousPage();
    expect(component.currentPage()).toBe(1);

    component.nextPage();
    expect(component.currentPage()).toBe(2);

    component.nextPage();
    expect(component.currentPage()).toBe(2);
  });

  it('navigates to edit route', () => {
    component.onEdit(products[0]);

    expect(router.navigate).toHaveBeenCalledWith(['/products', products[0].id, 'edit']);
  });
});
