import { TestBed, inject } from '@angular/core/testing';

import { StitchService } from './stitch.service';

describe('StitchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StitchService]
    });
  });

  it('should be created', inject([StitchService], (service: StitchService) => {
    expect(service).toBeTruthy();
  }));
});
