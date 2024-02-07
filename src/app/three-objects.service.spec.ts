import { TestBed } from '@angular/core/testing';

import { ThreeObjectsService } from './three-objects.service';

describe('ThreeObjectsService', () => {
  let service: ThreeObjectsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThreeObjectsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
