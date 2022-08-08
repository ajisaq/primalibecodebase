import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingClusterRulesComponent } from './booking-cluster-rules.component';

describe('BookingClusterRulesComponent', () => {
  let component: BookingClusterRulesComponent;
  let fixture: ComponentFixture<BookingClusterRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingClusterRulesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingClusterRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
