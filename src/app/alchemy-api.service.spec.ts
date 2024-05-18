import { TestBed } from '@angular/core/testing';

import { AlchemyApiService } from './alchemy-api.service';

describe('ApiService', () => {
  let service: AlchemyApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlchemyApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
