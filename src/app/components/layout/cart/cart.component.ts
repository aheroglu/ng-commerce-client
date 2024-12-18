import { Component } from '@angular/core';
import { CartItemModel } from '../../../models/cart-item.model';
import { HttpService } from '../../../services/http.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SwalService } from '../../../services/swal.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { productsImageUrl } from '../../../constants';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [NgxSpinnerModule, FormsModule, CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  cartItems: CartItemModel[] = [];
  cartId: string = '';

  imageUrl = productsImageUrl;

  constructor(
    private http: HttpService,
    private spinner: NgxSpinnerService,
    private auth: AuthService,
    private swal: SwalService
  ) {
    this.getCartItems();
  }

  getCartItems() {
    this.spinner.show();

    this.http
      .post<CartItemModel[]>(
        'CartItems/GetAllByUser',
        `appUserId=${this.auth.user.id}`
      )
      .subscribe({
        next: (res) => {
          if (res.data) {
            this.cartItems = res.data;
            this.spinner.hide();
          } else if (res.errorMessages) {
            res.errorMessages.forEach((error) => {
              this.swal.callToast(error, 'error');
            });
            this.spinner.hide();
          }
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
          this.spinner.hide();
        },
      });
  }

  calculateSubtotal() {
    let subtotal: number = 0;

    if (this.cartItems && this.cartItems.length > 0) {
      for (let item of this.cartItems) {
        subtotal += item.product.price * item.quantity;
      }
    }

    return subtotal;
  }

  increaseQuantity(cartItem: CartItemModel) {
    if (cartItem) {
      this.spinner.show();

      this.http.post<CartItemModel>('CartItems/IncreaseQuantity', `cartItemId=${cartItem.id}`).subscribe({
        next: res => {
          if (res.successMessage) {
            this.swal.callToast(res.successMessage);
            this.getCartItems();
          } else if (res.errorMessages) {
            res.errorMessages.forEach(error => {
              this.swal.callToast(error, 'error');
            })
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

  decreaseQuantity(cartItem: CartItemModel) {
    if (cartItem) {
      if (cartItem.quantity === 1) {
        this.removeCartItem(cartItem)
        return;
      }

      this.spinner.show();

      this.http.post<CartItemModel>('CartItems/DecreaseQuantity', `cartItemId=${cartItem.id}`).subscribe({
        next: res => {
          if (res.successMessage) {
            this.swal.callToast(res.successMessage);
            this.getCartItems();
          } else if (res.errorMessages) {
            res.errorMessages.forEach(error => {
              this.swal.callToast(error, 'error');
            })
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

  removeCartItem(cartItem: CartItemModel) {
    if (cartItem) {
      this.swal.callSwal(
        'Remove Product From Cart',
        'Are you sure you want to remove this item from cart?',
        'Remove',
        'Cancel',
        'question',
        () => {
          this.spinner.show();

          this.http
            .post<CartItemModel>('CartItems/Delete', `cartItemId=${cartItem.id}`)
            .subscribe({
              next: (res) => {
                if (res.successMessage) {
                  this.swal.callToast(res.successMessage);
                  this.getCartItems();
                } else if (res.errorMessages) {
                  res.errorMessages.forEach((error) => {
                    this.swal.callToast(error, 'error');
                  });
                  this.spinner.hide();
                }
              },
              error: (err: HttpErrorResponse) => {
                console.log(err);
                this.spinner.hide();
              },
            });
        }
      );
    }
  }
}
