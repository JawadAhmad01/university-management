import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkAttendence } from './mark-attendence';

describe('MarkAttendence', () => {
  let component: MarkAttendence;
  let fixture: ComponentFixture<MarkAttendence>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarkAttendence]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarkAttendence);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
