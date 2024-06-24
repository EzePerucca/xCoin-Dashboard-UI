import { TestBed } from '@angular/core/testing';

import { AuthGoogleService } from './auth-google.service';
import { AppModule } from './app.module';


describe('AuthGoogleService', () => {
  let service: AuthGoogleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    });
    service = TestBed.inject(AuthGoogleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
