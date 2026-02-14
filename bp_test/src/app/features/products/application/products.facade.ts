import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product, ProductMutationResponse } from '../domain/entities/product.entity';
import { PRODUCT_REPOSITORY, ProductRepository } from '../domain/repositories/product.repository';

@Injectable({ providedIn: 'root' })
export class ProductsFacade {
  constructor(@Inject(PRODUCT_REPOSITORY) private readonly productRepository: ProductRepository) {}

  getProducts(): Observable<Product[]> {
    return this.productRepository.getProducts();
  }

  getProductById(id: string): Observable<Product> {
    return this.productRepository.getProductById(id);
  }

  verifyId(id: string): Observable<boolean> {
    return this.productRepository.verifyId(id);
  }

  createProduct(product: Product): Observable<ProductMutationResponse> {
    return this.productRepository.createProduct(product);
  }

  updateProduct(id: string, product: Partial<Product>): Observable<ProductMutationResponse> {
    return this.productRepository.updateProduct(id, product);
  }

  deleteProduct(id: string): Observable<ProductMutationResponse> {
    return this.productRepository.deleteProduct(id);
  }
}
