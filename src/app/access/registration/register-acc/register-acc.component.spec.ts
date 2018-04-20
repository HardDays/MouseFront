import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterAccComponent } from './register-acc.component';

describe('RegisterAccComponent', () => {
  let component: RegisterAccComponent;
  let fixture: ComponentFixture<RegisterAccComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterAccComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterAccComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
