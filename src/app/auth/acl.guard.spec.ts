import { TestBed, async, inject } from '@angular/core/testing';

import { AclGuard } from './acl.guard';

describe('AclGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AclGuard]
    });
  });

  it('should ...', inject([AclGuard], (guard: AclGuard) => {
    expect(guard).toBeTruthy();
  }));
});
