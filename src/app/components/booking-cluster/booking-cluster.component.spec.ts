import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingClusterComponent } from './booking-cluster.component';

describe('BookingClusterComponent', () => {
  let component: BookingClusterComponent;
  let fixture: ComponentFixture<BookingClusterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingClusterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingClusterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
