import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateResComponent } from './private-res.component';

describe('PrivateResComponent', () => {
  let component: PrivateResComponent;
  let fixture: ComponentFixture<PrivateResComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivateResComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivateResComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
