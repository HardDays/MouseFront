import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OneCommentComponent } from './one-comment.component';

describe('OneCommentComponent', () => {
  let component: OneCommentComponent;
  let fixture: ComponentFixture<OneCommentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OneCommentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OneCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
