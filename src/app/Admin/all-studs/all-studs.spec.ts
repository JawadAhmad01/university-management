import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllStuds } from './all-studs';

describe('AllStuds', () => {
  let component: AllStuds;
  let fixture: ComponentFixture<AllStuds>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllStuds]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllStuds);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
