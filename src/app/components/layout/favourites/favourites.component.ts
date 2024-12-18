import { Component } from '@angular/core';
import { FavouriteModel } from '../../../models/favourite.model';
import { HttpService } from '../../../services/http.service';
import { SwalService } from '../../../services/swal.service';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-favourites',
  standalone: true,
  imports: [RouterLink, NgxSpinnerModule, CommonModule],
  templateUrl: './favourites.component.html',
  styleUrl: './favourites.component.css',
})
export class FavouritesComponent {
  favourites: FavouriteModel[] | undefined = [];

  constructor(
    private http: HttpService,
    private swal: SwalService,
    private auth: AuthService,
    private spinner: NgxSpinnerService
  ) {
    this.getFavourites();
  }

  getFavourites() {
    this.spinner.show();

    this.http
      .post<FavouriteModel[]>(
        'Favourites/GetAllByUser',
        `appUserId=${this.auth.user.id}`
      )
      .subscribe({
        next: (res) => {
          if (res.data) {
            console.log(res.data);

            this.favourites = res.data;
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

  deleteFromFavourites(favourite: FavouriteModel) {
    if (favourite) {
      this.swal.callSwal(
        'Remove Product From Favourites',
        'Are you sure you want to remove this product from your favourites?',
        'Remove',
        'Cancel',
        'question',
        () => {
          this.spinner.show();

          this.http
            .post<FavouriteModel>('Favourites/Delete', `id=${favourite.id}`)
            .subscribe({
              next: (res) => {
                if (res.successMessage) {
                  this.swal.callToast(res.successMessage);
                  this.getFavourites();
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
