import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pay-fee',
  imports: [FormsModule],
  templateUrl: './pay-fee.html',
  styleUrl: './pay-fee.scss',
})
export class PayFee implements OnInit {
  private http = inject(HttpClient);
  protected voucherObj: any = {};
  protected searchVal: string = '';
  protected voucherToggle: boolean = false;

  protected programList: any[] = [];

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:3000/fees').subscribe({
      next: (res) => {
        this.programList = res;
      },
    });
  }

  getVoucher() {
    this.http.get<any[]>('http://localhost:3000/fees').subscribe({
      next: (res) => {
        const findTime = res.find((finded) => finded.student === this.searchVal);
        if (findTime) {
          this.voucherObj = findTime;
          this.voucherToggle = true;
        } else {
          this.voucherObj = {};
          this.voucherToggle = false;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
