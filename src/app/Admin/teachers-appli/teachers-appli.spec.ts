import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeachersAppli } from './teachers-appli';

describe('TeachersAppli', () => {
  let component: TeachersAppli;
  let fixture: ComponentFixture<TeachersAppli>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeachersAppli]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeachersAppli);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
