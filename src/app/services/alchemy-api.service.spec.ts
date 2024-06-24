import { TestBed } from '@angular/core/testing';
import { AlchemyApiService } from './alchemy-api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('ApiService', () => {
  let service: AlchemyApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(AlchemyApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
