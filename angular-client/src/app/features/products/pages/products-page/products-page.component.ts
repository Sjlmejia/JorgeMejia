import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Product } from '../../domain/entities/product.entity';
import { ProductsFacade } from '../../application/products.facade';
import { ProductListComponent } from '../../components/product-list/product-list.component';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ProductListComponent],
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.css']
})
export class ProductsPageComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  readonly products = signal<Product[]>([]);
  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly searchTerm = signal('');
  readonly pageSize = signal(5);
  readonly currentPage = signal(1);

  constructor(
    private readonly productsFacade: ProductsFacade,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  readonly filteredProducts = computed(() => {
    const normalizedSearch = this.searchTerm().trim().toLowerCase();
    const products = this.products();

    if (!normalizedSearch) {
      return products;
    }

    return products.filter((product) =>
      [product.id, product.name, product.description]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch)
    );
  });

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.filteredProducts().length / this.pageSize())));

  readonly paginatedProducts = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredProducts().slice(start, start + this.pageSize());
  });

  loadProducts(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.productsFacade.getProducts().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (products) => {
        this.products.set(products);
        this.currentPage.set(1);
        this.loading.set(false);
      },
      error: (error: Error) => {
        this.errorMessage.set(error.message);
        this.loading.set(false);
      }
    });
  }

  onSearchChange(value: string): void {
    this.searchTerm.set(value);
    this.currentPage.set(1);
  }

  onPageSizeChange(size: number): void {
    this.pageSize.set(Number(size));
    this.currentPage.set(1);
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update((page) => page - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((page) => page + 1);
    }
  }

  onEdit(product: Product): void {
    this.router.navigate(['/products', product.id, 'edit']);
  }

}
