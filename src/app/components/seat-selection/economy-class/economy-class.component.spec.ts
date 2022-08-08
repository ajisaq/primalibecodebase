import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EconomyClassComponent } from './economy-class.component';

describe('EconomyClassComponent', () => {
  let component: EconomyClassComponent;
  let fixture: ComponentFixture<EconomyClassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EconomyClassComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EconomyClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
