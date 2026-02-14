import { Component, HostListener, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../domain/entities/product.entity';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {
  readonly products = input<Product[]>([]);
  readonly loading = input(false);
  readonly pageSize = input(5);
  readonly totalResults = input(0);
  readonly edit = output<Product>();
  readonly pageSizeChange = output<number>();

  readonly openedMenuId = signal<string | null>(null);

  trackById = (_: number, product: Product): string => {
    return product.id;
  };

  toggleMenu(id: string, event: MouseEvent): void {
    event.stopPropagation();
    setTimeout(() => {
      this.openedMenuId.update((openedId) => (openedId === id ? null : id));
    }, 0);
  }

  onPageSizeChange(value: string): void {
    this.pageSizeChange.emit(Number(value));
  }

  onPageSizeSelectChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.onPageSizeChange(target.value);
  }

  onEdit(product: Product): void {
    this.edit.emit(product);
    this.openedMenuId.set(null);
  }

  onImageError(event: Event): void {
    const image = event.target as HTMLImageElement;
    image.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="120" height="120"%3E%3Crect width="100%25" height="100%25" fill="%23e4e7eb"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23616e7c" font-family="Arial" font-size="14"%3ELogo%3C/text%3E%3C/svg%3E';
  }

  @HostListener('document:click', ['$event'])
  closeMenu(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.menu-cell')) {
      this.openedMenuId.set(null);
    }
  }
}
