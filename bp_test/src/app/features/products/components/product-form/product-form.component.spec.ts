import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { ProductsFacade } from '../../application/products.facade';
import { Product } from '../../domain/entities/product.entity';
import { ProductFormComponent } from './product-form.component';

describe('ProductFormComponent', () => {
  let fixture: ReturnType<typeof TestBed.createComponent<ProductFormComponent>>;
  let component: ProductFormComponent;
  let productsFacade: jest.Mocked<Pick<ProductsFacade, 'verifyId'>>;

  const createProduct = (): Product => ({
    id: 'p001',
    name: 'Cuenta de ahorro',
    description: 'Producto financiero para ahorro personal',
    logo: 'https://example.com/logo.png',
    date_release: '2026-03-10',
    date_revision: '2027-03-10'
  });

  beforeEach(() => {
    productsFacade = {
      verifyId: jest.fn()
    };
    productsFacade.verifyId.mockReturnValue(of(false));

    TestBed.configureTestingModule({
      imports: [ProductFormComponent],
      providers: [{ provide: ProductsFacade, useValue: productsFacade }]
    });

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('starts in create mode with enabled id control', () => {
    expect(component.editing()).toBe(false);
    expect(component.form.get('id')?.enabled).toBe(true);
  });

  it('syncs form with selected product and disables id in edit mode', () => {
    const product = createProduct();

    fixture.componentRef.setInput('selectedProduct', product);
    fixture.detectChanges();

    expect(component.editing()).toBe(true);
    expect(component.form.getRawValue()).toEqual(product);
    expect(component.form.get('id')?.disabled).toBe(true);
  });

  it('marks controls as touched when submitting invalid form', () => {
    jest.spyOn(component.save, 'emit');

    component.submit();

    expect(component.save.emit).not.toHaveBeenCalled();
    expect(component.form.touched).toBe(true);
  });

  it('emits save event with form payload when form is valid', fakeAsync(() => {
    const product = createProduct();
    jest.spyOn(component.save, 'emit');

    component.form.patchValue(product);
    component.form.get('id')?.updateValueAndValidity();
    tick(251);
    component.submit();

    expect(component.save.emit).toHaveBeenCalledWith(product);
  }));

  it('requires at least 5 characters in name', () => {
    component.form.patchValue({
      id: 'p001',
      name: 'abcd',
      description: 'Producto financiero para ahorro personal',
      logo: 'https://example.com/logo.png',
      date_release: '2026-03-10',
      date_revision: '2027-03-10'
    });

    const nameControl = component.form.get('name');
    expect(nameControl?.errors?.['minlength']).toBeTruthy();
    expect(nameControl?.invalid).toBe(true);
  });

  it('resets form in create mode and keeps id enabled', () => {
    component.form.patchValue(createProduct());

    component.resetForm();

    expect(component.form.get('id')?.enabled).toBe(true);
    expect(component.form.get('name')?.value).toBeNull();
  });

  it('resets form to selected product in edit mode', () => {
    const product = createProduct();
    fixture.componentRef.setInput('selectedProduct', product);
    fixture.detectChanges();

    component.form.patchValue({ name: 'Otro Nombre' });
    component.resetForm();

    expect(component.form.getRawValue()).toEqual(product);
    expect(component.form.get('id')?.disabled).toBe(true);
  });

  it('updates date_revision automatically when date_release changes', () => {
    component.form.get('date_release')?.setValue('2026-04-20');

    expect(component.form.get('date_revision')?.value).toBe('2027-04-20');
  });

  it('returns expected validation messages', () => {
    const idControl = component.form.get('id');
    expect(idControl).not.toBeNull();
    if (!idControl) {
      return;
    }

    idControl.setErrors({ required: true });
    expect(component.getError('id')).toBe('Este campo es requerido.');

    idControl.setErrors({ minlength: { requiredLength: 3 } });
    expect(component.getError('id')).toBe('Mínimo 3 caracteres.');

    idControl.setErrors({ maxlength: { requiredLength: 10 } });
    expect(component.getError('id')).toBe('Máximo 10 caracteres.');

    idControl.setErrors({ idTaken: true });
    expect(component.getError('id')).toBe('El ID ya existe.');

    idControl.setErrors({ releaseDateBeforeToday: true });
    expect(component.getError('id')).toBe('La fecha debe ser igual o mayor a la fecha actual.');

    idControl.setErrors({ random: true });
    expect(component.getError('id')).toBe('Campo inválido.');
  });

  it('hasError checks touched/submitted status', () => {
    const nameControl = component.form.get('name');
    expect(nameControl).not.toBeNull();
    if (!nameControl) {
      return;
    }

    nameControl.setErrors({ required: true });
    expect(component.hasError('name')).toBe(false);

    nameControl.markAsTouched();
    expect(component.hasError('name')).toBe(true);
  });

  it('detects date pair validation error only after touch/submission', () => {
    component.form.patchValue({
      date_release: '2026-01-01',
      date_revision: '2026-01-10'
    });

    expect(component.form.errors?.['invalidRevisionDate']).toBe(true);
    expect(component.hasDatePairError()).toBe(false);

    component.form.markAsTouched();
    expect(component.hasDatePairError()).toBe(true);
  });

  it('runs async unique id validator and marks idTaken', fakeAsync(() => {
    const idControl = component.form.get('id');
    expect(idControl).not.toBeNull();
    if (!idControl) {
      return;
    }

    productsFacade.verifyId.mockReturnValue(of(true));

    idControl.setValue('valid123');
    idControl.updateValueAndValidity();
    tick(251);

    expect(productsFacade.verifyId).toHaveBeenCalledWith('valid123');
    expect(idControl.errors?.['idTaken']).toBe(true);
  }));

  it('skips async unique id validation while editing', fakeAsync(() => {
    const product = createProduct();
    fixture.componentRef.setInput('selectedProduct', product);
    fixture.detectChanges();

    const idControl = component.form.get('id');
    expect(idControl).not.toBeNull();
    if (!idControl) {
      return;
    }

    idControl.enable({ emitEvent: false });
    idControl.setValue('another');
    idControl.updateValueAndValidity();
    tick(251);

    expect(productsFacade.verifyId).not.toHaveBeenCalled();
    expect(idControl.errors).toBeNull();
  }));
});
