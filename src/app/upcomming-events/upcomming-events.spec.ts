import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcommingEvents } from './upcomming-events';

describe('UpcommingEvents', () => {
  let component: UpcommingEvents;
  let fixture: ComponentFixture<UpcommingEvents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpcommingEvents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpcommingEvents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
