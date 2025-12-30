import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { studGardGuard } from './stud-gard-guard';

describe('studGardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => studGardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
