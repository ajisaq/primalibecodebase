import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleCarouselComponent } from './schedule-carousel.component';

describe('ScheduleCarouselComponent', () => {
  let component: ScheduleCarouselComponent;
  let fixture: ComponentFixture<ScheduleCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduleCarouselComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
