import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewVenueComponent } from './preview-venue.component';

describe('PreviewVenueComponent', () => {
  let component: PreviewVenueComponent;
  let fixture: ComponentFixture<PreviewVenueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewVenueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewVenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
