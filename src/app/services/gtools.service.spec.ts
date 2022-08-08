import { TestBed } from '@angular/core/testing';

import { GtoolsService } from './gtools.service';

describe('GtoolsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GtoolsService = TestBed.get(GtoolsService);
    expect(service).toBeTruthy();
  });
});
