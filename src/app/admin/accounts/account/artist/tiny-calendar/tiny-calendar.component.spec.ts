import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TinyCalendarComponent } from './tiny-calendar.component';

describe('TinyCalendarComponent', () => {
  let component: TinyCalendarComponent;
  let fixture: ComponentFixture<TinyCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TinyCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TinyCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
