import { TestBed } from '@angular/core/testing';

import { IbeServiceService } from './ibe-service.service';

describe('IbeServiceService', () => {
  let service: IbeServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IbeServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
