import { Component } from '@angular/core';
import { OrderModel } from '../../../models/order.model';
import { HttpService } from '../../../services/http.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { SwalService } from '../../../services/swal.service';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [NgxSpinnerModule, CommonModule, FormsModule, RouterLink],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent {
  orders: OrderModel[] = [];

  constructor(private http: HttpService, private auth: AuthService, private spinner: NgxSpinnerService, private swal: SwalService) {
    this.getOrders();
  }

  getOrders() {
    this.spinner.show();

    this.http.post<OrderModel[]>('Orders/GetAllByUser', `appUserId=${this.auth.user.id}`).subscribe({
      next: res => {
        if (res.data) {
          this.orders = res.data;
          this.spinner.hide();
        } else if (res.errorMessages) {
          res.errorMessages.forEach(error => {
            this.swal.callToast(error, 'error');
          });
          this.spinner.hide();
        }
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
        this.spinner.hide();
      }
    })
  }

  getOrderStatus(status: number): string {
    switch (status) {
      case 1:
        return 'Pending';
      case 2:
        return 'Processing';
      case 3:
        return 'Shipped';
      case 4:
        return 'Delivered';
      case 5:
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  }
}
