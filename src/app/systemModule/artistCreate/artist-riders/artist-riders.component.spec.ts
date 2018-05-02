import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistRidersComponent } from './artist-riders.component';

describe('ArtistRidersComponent', () => {
  let component: ArtistRidersComponent;
  let fixture: ComponentFixture<ArtistRidersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtistRidersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtistRidersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
