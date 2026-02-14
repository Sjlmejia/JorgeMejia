import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Product, ProductMutationResponse } from '../entities/product.entity';

export interface ProductRepository {
  getProducts(): Observable<Product[]>;
  getProductById(id: string): Observable<Product>;
  verifyId(id: string): Observable<boolean>;
  createProduct(product: Product): Observable<ProductMutationResponse>;
  updateProduct(id: string, product: Partial<Product>): Observable<ProductMutationResponse>;
  deleteProduct(id: string): Observable<ProductMutationResponse>;
}

export const PRODUCT_REPOSITORY = new InjectionToken<ProductRepository>('PRODUCT_REPOSITORY');
