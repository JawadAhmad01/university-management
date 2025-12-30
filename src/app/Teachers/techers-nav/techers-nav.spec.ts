import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechersNav } from './techers-nav';

describe('TechersNav', () => {
  let component: TechersNav;
  let fixture: ComponentFixture<TechersNav>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechersNav]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechersNav);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
