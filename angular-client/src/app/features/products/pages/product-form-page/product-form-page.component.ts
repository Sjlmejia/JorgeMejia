import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Product } from '../../domain/entities/product.entity';
import { ProductsFacade } from '../../application/products.facade';
import { ProductFormComponent } from '../../components/product-form/product-form.component';

@Component({
  selector: 'app-product-form-page',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductFormComponent],
  templateUrl: './product-form-page.component.html',
  styleUrls: ['./product-form-page.component.css']
})
export class ProductFormPageComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  readonly product = signal<Product | null>(null);
  readonly loading = signal(false);
  readonly submitting = signal(false);
  readonly errorMessage = signal('');
  private readonly productId = signal<string | null>(null);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly productsFacade: ProductsFacade
  ) {}

  readonly editing = computed(() => !!this.productId());

  ngOnInit(): void {
    this.productId.set(this.route.snapshot.paramMap.get('id'));
    const productId = this.productId();

    if (!productId) {
      return;
    }

    this.loading.set(true);
    this.productsFacade.getProductById(productId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (product) => {
        this.product.set(product);
        this.loading.set(false);
      },
      error: (error: Error) => {
        this.errorMessage.set(error.message);
        this.loading.set(false);
      }
    });
  }

  onSave(product: Product): void {
    this.submitting.set(true);
    this.errorMessage.set('');
    const productId = this.productId();

    const request$ = this.editing() && productId
      ? this.productsFacade.updateProduct(productId, product)
      : this.productsFacade.createProduct(product);

    request$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.submitting.set(false);
        this.router.navigate(['/products']);
      },
      error: (error: Error) => {
        this.errorMessage.set(error.message);
        this.submitting.set(false);
      }
    });
  }
}
