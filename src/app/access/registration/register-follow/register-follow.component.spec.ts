import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterFollowComponent } from './register-follow.component';

describe('RegisterFollowComponent', () => {
  let component: RegisterFollowComponent;
  let fixture: ComponentFixture<RegisterFollowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterFollowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterFollowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
