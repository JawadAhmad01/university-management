import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayFee } from './pay-fee';

describe('PayFee', () => {
  let component: PayFee;
  let fixture: ComponentFixture<PayFee>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayFee]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayFee);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
