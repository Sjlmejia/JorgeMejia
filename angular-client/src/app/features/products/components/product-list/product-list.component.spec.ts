import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Product } from '../../domain/entities/product.entity';
import { ProductListComponent } from './product-list.component';

describe('ProductListComponent', () => {
  let component: ProductListComponent;

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
      imports: [ProductListComponent]
    });

    const fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
  });

  it('returns product id for trackBy', () => {
    expect(component.trackById(0, product)).toBe(product.id);
  });

  it('emits pageSizeChange as number', () => {
    jest.spyOn(component.pageSizeChange, 'emit');

    component.onPageSizeChange('10');

    expect(component.pageSizeChange.emit).toHaveBeenCalledWith(10);
  });

  it('emits pageSizeChange from select change event', () => {
    jest.spyOn(component.pageSizeChange, 'emit');

    const event = {
      target: { value: '20' }
    } as unknown as Event;

    component.onPageSizeSelectChange(event);

    expect(component.pageSizeChange.emit).toHaveBeenCalledWith(20);
  });

  it('emits edit and closes menu', () => {
    jest.spyOn(component.edit, 'emit');
    component.openedMenuId.set(product.id);

    component.onEdit(product);

    expect(component.edit.emit).toHaveBeenCalledWith(product);
    expect(component.openedMenuId()).toBeNull();
  });

  it('sets fallback image when image loading fails', () => {
    const image = document.createElement('img');
    image.src = 'broken-url';

    component.onImageError({ target: image } as unknown as Event);

    expect(image.src).toContain('data:image/svg+xml');
  });

  it('toggles row menu on click', fakeAsync(() => {
    const stopPropagation = jest.fn();
    const event = { stopPropagation } as unknown as MouseEvent;

    component.toggleMenu(product.id, event);
    tick(0);
    expect(component.openedMenuId()).toBe(product.id);

    component.toggleMenu(product.id, event);
    tick(0);
    expect(component.openedMenuId()).toBeNull();
    expect(stopPropagation).toHaveBeenCalledTimes(2);
  }));

  it('closes menu when click occurs outside menu-cell', () => {
    component.openedMenuId.set(product.id);

    const outside = document.createElement('div');
    component.closeMenu({ target: outside } as unknown as Event);

    expect(component.openedMenuId()).toBeNull();
  });

  it('keeps menu open when click occurs inside menu-cell', () => {
    component.openedMenuId.set(product.id);

    const cell = document.createElement('div');
    cell.classList.add('menu-cell');
    const inner = document.createElement('span');
    cell.appendChild(inner);

    component.closeMenu({ target: inner } as unknown as Event);

    expect(component.openedMenuId()).toBe(product.id);
  });
});
