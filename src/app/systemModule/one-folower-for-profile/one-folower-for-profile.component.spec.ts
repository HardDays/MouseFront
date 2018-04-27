import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OneFolowerForProfileComponent } from './one-folower-for-profile.component';

describe('OneFolowerForProfileComponent', () => {
  let component: OneFolowerForProfileComponent;
  let fixture: ComponentFixture<OneFolowerForProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OneFolowerForProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OneFolowerForProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
