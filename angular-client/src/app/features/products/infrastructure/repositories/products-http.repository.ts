import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Product, ProductListResponse, ProductMutationResponse } from '../../domain/entities/product.entity';
import { ProductRepository } from '../../domain/repositories/product.repository';

@Injectable()
export class ProductsHttpRepository implements ProductRepository {
  private readonly endpoint = `${environment.apiBaseUrl}/products`;

  constructor(private readonly http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<ProductListResponse>(this.endpoint).pipe(map((response) => response.data));
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.endpoint}/${id}`);
  }

  verifyId(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.endpoint}/verification/${id}`);
  }

  createProduct(product: Product): Observable<ProductMutationResponse> {
    return this.http.post<ProductMutationResponse>(this.endpoint, product);
  }

  updateProduct(id: string, product: Partial<Product>): Observable<ProductMutationResponse> {
    return this.http.put<ProductMutationResponse>(`${this.endpoint}/${id}`, product);
  }

  deleteProduct(id: string): Observable<ProductMutationResponse> {
    return this.http.delete<ProductMutationResponse>(`${this.endpoint}/${id}`);
  }
}
