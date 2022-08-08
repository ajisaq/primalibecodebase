import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundTripSearchFormComponent } from './round-trip-search-form.component';

describe('RoundTripSearchFormComponent', () => {
  let component: RoundTripSearchFormComponent;
  let fixture: ComponentFixture<RoundTripSearchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoundTripSearchFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundTripSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
