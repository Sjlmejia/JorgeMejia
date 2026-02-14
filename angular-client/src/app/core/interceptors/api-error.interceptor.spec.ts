import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { apiErrorInterceptor } from './api-error.interceptor';

describe('apiErrorInterceptor', () => {
  let http: HttpClient;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([apiErrorInterceptor])),
        provideHttpClientTesting()
      ]
    });

    http = TestBed.inject(HttpClient);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('maps API error message from payload', (done) => {
    http.get('/test').subscribe({
      next: () => { throw new Error('Expected error'); },
      error: (error: Error) => {
        expect(error.message).toBe('Mensaje API');
        done();
      }
    });

    const req = httpController.expectOne('/test');
    req.flush({ message: 'Mensaje API' }, { status: 400, statusText: 'Bad Request' });
  });

  it('returns fallback message when payload has no message', (done) => {
    http.get('/test-2').subscribe({
      next: () => { throw new Error('Expected error'); },
      error: (error: Error) => {
        expect(error.message).toBe('Unexpected API error');
        done();
      }
    });

    const req = httpController.expectOne('/test-2');
    req.flush({}, { status: 500, statusText: 'Server Error' });
  });
});
