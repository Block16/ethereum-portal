import { TestBed, inject } from '@angular/core/testing';

import { CoreKeyManagerService } from './core-key-manager.service';

describe('CoreKeyManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CoreKeyManagerService]
    });
  });

  it('should be created', inject([CoreKeyManagerService], (service: CoreKeyManagerService) => {
    expect(service).toBeTruthy();
  }));
});
