import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { HttpService } from '../../../services/http.service';
import { SwalService } from '../../../services/swal.service';
import { OrderItemModel } from '../../../models/order-item.model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { OrderModel } from '../../../models/order.model';
import { productsImageUrl } from '../../../constants';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [NgxSpinnerModule, CommonModule, RouterLink],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.css'
})
export class OrderDetailComponent implements OnInit {
  orderId: string | null = '';

  order: OrderModel = new OrderModel();
  orderItems: OrderItemModel[] = [];

  imageUrl = productsImageUrl;

  constructor(private http: HttpService, private spinner: NgxSpinnerService, private swal: SwalService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('orderId');
    if (this.orderId) this.getOrder(); this.getOrderItems();
  }

  getOrder() {
    this.spinner.show();

    this.http.post<OrderModel>('Orders/GetById', `orderId=${this.orderId}`).subscribe({
      next: res => {
        if (res.data) {
          this.order = res.data
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

  getOrderItems() {
    if (this.orderId) {
      this.spinner.show();

      this.http.post<OrderItemModel[]>('OrderItems/GetAllByOrder', `orderId=${this.orderId}`).subscribe({
        next: res => {
          if (res.data) {
            this.orderItems = res.data;
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
