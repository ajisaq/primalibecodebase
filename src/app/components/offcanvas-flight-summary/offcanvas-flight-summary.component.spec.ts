import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffcanvasFlightSummaryComponent } from './offcanvas-flight-summary.component';

describe('OffcanvasFlightSummaryComponent', () => {
  let component: OffcanvasFlightSummaryComponent;
  let fixture: ComponentFixture<OffcanvasFlightSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OffcanvasFlightSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OffcanvasFlightSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
