import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OneWaySearchFormComponent } from './one-way-search-form.component';

describe('OneWaySearchFormComponent', () => {
  let component: OneWaySearchFormComponent;
  let fixture: ComponentFixture<OneWaySearchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OneWaySearchFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OneWaySearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
