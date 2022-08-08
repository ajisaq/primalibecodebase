import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassengerTypeDropdownComponent } from './passenger-type-dropdown.component';

describe('PassengerTypeDropdownComponent', () => {
  let component: PassengerTypeDropdownComponent;
  let fixture: ComponentFixture<PassengerTypeDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PassengerTypeDropdownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PassengerTypeDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
