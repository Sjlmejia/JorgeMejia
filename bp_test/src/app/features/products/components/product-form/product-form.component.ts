import { AsyncValidatorFn, AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Component, DestroyRef, OnInit, computed, effect, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, catchError, map, of, switchMap, timer } from 'rxjs';
import { Product } from '../../domain/entities/product.entity';
import { ProductsFacade } from '../../application/products.facade';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  readonly selectedProduct = input<Product | null>(null);
  readonly submitting = input(false);
  readonly save = output<Product>();

  private readonly submitted = signal(false);

  readonly form = this.formBuilder.group(
    {
      id: this.formBuilder.control('', {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(10)],
        asyncValidators: [this.uniqueIdValidator()],
        updateOn: 'blur'
      }),
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', [Validators.required]],
      date_release: ['', [Validators.required, this.releaseDateValidator()]],
      date_revision: ['', [Validators.required]]
    },
    { validators: [this.revisionDateValidator()] }
  );

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly productsFacade: ProductsFacade
  ) {
    effect(() => {
      this.syncFormWithProduct(this.selectedProduct());
    });
  }

  readonly editing = computed(() => !!this.selectedProduct());

  ngOnInit(): void {
    this.setupDateReleaseListener();
  }

  submit(): void {
    this.submitted.set(true);

    if (this.form.invalid || this.form.pending) {
      this.form.markAllAsTouched();
      return;
    }

    this.save.emit(this.form.getRawValue() as Product);
  }

  resetForm(): void {
    this.submitted.set(false);
    const selectedProduct = this.selectedProduct();

    if (selectedProduct) {
      this.form.reset(selectedProduct);
      this.form.get('id')?.disable({ emitEvent: false });
      return;
    }

    this.form.reset();
    this.form.get('id')?.enable({ emitEvent: false });
  }

  hasError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.invalid && (control.touched || this.submitted());
  }

  hasDatePairError(): boolean {
    return !!this.form.errors?.['invalidRevisionDate'] && (this.form.touched || this.submitted());
  }

  getError(controlName: string): string {
    const control = this.form.get(controlName);

    if (!control?.errors) {
      return '';
    }

    if (control.errors['required']) {
      return 'Este campo es requerido.';
    }
    if (control.errors['minlength']) {
      return `Mínimo ${control.errors['minlength'].requiredLength} caracteres.`;
    }
    if (control.errors['maxlength']) {
      return `Máximo ${control.errors['maxlength'].requiredLength} caracteres.`;
    }
    if (control.errors['idTaken']) {
      return 'El ID ya existe.';
    }
    if (control.errors['releaseDateBeforeToday']) {
      return 'La fecha debe ser igual o mayor a la fecha actual.';
    }

    return 'Campo inválido.';
  }

  private syncFormWithProduct(selectedProduct: Product | null): void {
    if (selectedProduct) {
      this.form.reset(selectedProduct);
      this.form.get('id')?.disable({ emitEvent: false });
      return;
    }

    this.form.reset();
    this.form.get('id')?.enable({ emitEvent: false });
  }

  private setupDateReleaseListener(): void {
    this.form.get('date_release')?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(value => {
      if (value) {
        const releaseDate = new Date(value);
        const revisionDate = new Date(releaseDate);
        revisionDate.setFullYear(revisionDate.getFullYear() + 1);
        this.form.get('date_revision')?.setValue(revisionDate.toISOString().split('T')[0], { emitEvent: false });
      }
    });
  }

  private uniqueIdValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (this.editing() || !control.value || control.invalid) {
        return of(null);
      }

      return timer(250).pipe(
        switchMap(() => this.productsFacade.verifyId(control.value)),
        map((exists) => (exists ? { idTaken: true } : null)),
        catchError(() => of(null))
      );
    };
  }

  private releaseDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const releaseDateStr = control.value;
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];

      return releaseDateStr >= todayStr ? null : { releaseDateBeforeToday: true };
    };
  }

  private revisionDateValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const releaseControl = formGroup.get('date_release');
      const revisionControl = formGroup.get('date_revision');

      if (!releaseControl?.value || !revisionControl?.value) {
        return null;
      }

      const releaseDate = new Date(releaseControl.value);
      const revisionDate = new Date(revisionControl.value);
      const expectedRevisionDate = new Date(releaseDate);
      expectedRevisionDate.setFullYear(expectedRevisionDate.getFullYear() + 1);

      return revisionDate.getTime() === expectedRevisionDate.getTime() ? null : { invalidRevisionDate: true };
    };
  }
}
