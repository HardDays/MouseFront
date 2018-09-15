import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTicketOpenedComponent } from './my-ticket-opened.component';

describe('MyTicketOpenedComponent', () => {
  let component: MyTicketOpenedComponent;
  let fixture: ComponentFixture<MyTicketOpenedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyTicketOpenedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyTicketOpenedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
