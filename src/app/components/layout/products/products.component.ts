import { productsImageUrl } from './../../../constants';
import { Component } from '@angular/core';
import { ProductModel } from '../../../models/product.model';
import { HttpService } from '../../../services/http.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { SwalService } from '../../../services/swal.service';
import { AuthService } from '../../../services/auth.service';
import { CartItemModel } from '../../../models/cart-item.model';
import { FavouriteModel } from '../../../models/favourite.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink, NgxSpinnerModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent {
  products: ProductModel[] | undefined = [];

  imageUrl = productsImageUrl;

  constructor(
    private http: HttpService,
    private spinner: NgxSpinnerService,
    private swal: SwalService,
    private auth: AuthService,
    private router: Router
  ) {
    this.getProducts();
  }

  getProducts() {
    this.spinner.show();

    this.http.post<ProductModel[]>('Products/GetAll').subscribe({
      next: (res) => {
        if (res.data) {
          this.products = res.data;
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

  addToCart(product: ProductModel) {
    if (product) {
      if (!this.auth.isAuthenticated()) {
        this.router.navigateByUrl('/signin');
        this.swal.callToast('Please sign in!', 'warning');
        return;
      }

      this.spinner.show();

      const data = {
        appUserId: this.auth.user.id,
        productId: product.id,
        quantity: 1,
      };

      this.http.post<CartItemModel>('CartItems/Create', null, data).subscribe({
        next: (res) => {
          if (res.successMessage) {
            this.swal.callToast(res.successMessage);
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
  }

  addToFavourites(product: ProductModel) {
    if (this.auth.user.id) {
      const data = {
        appUserId: this.auth.user.id,
        productId: product.id,
        priceWhenAdded: product.price,
      };

      if (product) {
        this.spinner.show();

        this.http
          .post<FavouriteModel>('Favourites/Create', null, data)
          .subscribe({
            next: (res) => {
              if (res.successMessage) {
                this.swal.callToast(res.successMessage);
                this.spinner.hide();
              } else if (res.errorMessages) {
                res.errorMessages.forEach((error) => {
                  this.swal.callToast(error, 'error');
                });
                this.spinner.hide();
              }
            },
          });
      }
    } else {
      this.swal.callToast('Please sign in!', 'warning');
      this.router.navigateByUrl('/signin');
    }
  }
}
