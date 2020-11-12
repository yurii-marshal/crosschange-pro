import { TestBed } from '@angular/core/testing';

import { GridService } from './grid.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteStub } from '../../../../testing/ActivatedRouteStub';
import { RouterTestingModule } from '@angular/router/testing';

describe('GridService', () => {
  let service: GridService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() }
      ]
    });
    service = TestBed.inject(GridService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
