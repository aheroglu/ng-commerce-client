import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../../services/http.service';
import { ProductModel } from '../../../models/product.model';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { CartItemModel } from '../../../models/cart-item.model';
import { AuthService } from '../../../services/auth.service';
import { SwalService } from '../../../services/swal.service';
import { FavouriteModel } from '../../../models/favourite.model';
import { productsImageUrl } from '../../../constants';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [NgxSpinnerModule, CommonModule, FormsModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent implements OnInit {
  product: ProductModel | undefined;
  productUrl: string | null = '';

  imageUrl = productsImageUrl!;
  selectedImage: string = '';

  quantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private http: HttpService,
    private spinner: NgxSpinnerService,
    private auth: AuthService,
    private swal: SwalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productUrl = this.route.snapshot.paramMap.get('url');
    if (this.productUrl) this.getProduct();
  }

  getProduct() {
    this.spinner.show();

    if (this.productUrl) {
      this.http
        .post<ProductModel>('Products/GetByUrl', `url=${this.productUrl}`)
        .subscribe({
          next: (res) => {
            if (res.data!.productImages.length > 0) {
              this.selectedImage = res.data!.productImages[0].image;
            }

            this.product = res.data;
            this.spinner.hide();
          },
          error: (err: HttpErrorResponse) => {
            this.spinner.hide();
            console.log(err);
          },
        });
    }
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
        quantity: this.quantity,
      };

      this.http.post<CartItemModel>('CartItems/Create', null, data).subscribe({
        next: (res) => {
          if (res.successMessage) {
            this.swal.callToast(res.successMessage);
            this.spinner.hide();
            this.router.navigate(['/cart']);
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

  changeMainImage(image: string) {
    this.selectedImage = image;
  }
}
