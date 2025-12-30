import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentMain } from './student-main';

describe('StudentMain', () => {
  let component: StudentMain;
  let fixture: ComponentFixture<StudentMain>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentMain]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentMain);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
