import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OneHumanGoingModalComponent } from './one-human-going-modal.component';

describe('OneHumanGoingModalComponent', () => {
  let component: OneHumanGoingModalComponent;
  let fixture: ComponentFixture<OneHumanGoingModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OneHumanGoingModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OneHumanGoingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
