import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketOnProfileComponent } from './ticket-on-profile.component';

describe('TicketOnProfileComponent', () => {
  let component: TicketOnProfileComponent;
  let fixture: ComponentFixture<TicketOnProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketOnProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketOnProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
