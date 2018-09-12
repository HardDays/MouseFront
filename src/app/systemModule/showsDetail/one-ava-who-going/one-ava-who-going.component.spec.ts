import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OneAvaWhoGoingComponent } from './one-ava-who-going.component';

describe('OneAvaWhoGoingComponent', () => {
  let component: OneAvaWhoGoingComponent;
  let fixture: ComponentFixture<OneAvaWhoGoingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OneAvaWhoGoingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OneAvaWhoGoingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
