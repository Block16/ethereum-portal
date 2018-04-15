import { TestBed, inject } from '@angular/core/testing';

import { TokenSymbolService } from './token-symbol.service';

describe('TokenSymbolService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TokenSymbolService]
    });
  });

  it('should be created', inject([TokenSymbolService], (service: TokenSymbolService) => {
    expect(service).toBeTruthy();
  }));
});
