import { TestBed } from '@angular/core/testing';

import { NajaService } from './naja.service';

describe('NajaService', () => {
  let service: NajaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NajaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
