import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FunProfileComponent } from './fun-profile.component';

describe('FunProfileComponent', () => {
  let component: FunProfileComponent;
  let fixture: ComponentFixture<FunProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FunProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FunProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
