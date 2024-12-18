import { Component } from '@angular/core';
import { BlacklistModel } from '../../../models/blacklist.model';
import { HttpService } from '../../../services/http.service';
import { SwalService } from '../../../services/swal.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-blacklist',
  standalone: true,
  imports: [NgxSpinnerModule, CommonModule, FormsModule],
  templateUrl: './blacklist.component.html',
  styleUrl: './blacklist.component.css',
})
export class BlacklistComponent {
  blacklists: BlacklistModel[] = [];

  constructor(
    private http: HttpService,
    private swal: SwalService,
    private spinner: NgxSpinnerService
  ) {
    this.getBlacklist();
  }

  getBlacklist() {
    this.spinner.show();

    this.http.post<BlacklistModel[]>('Blacklists/GetAll').subscribe({
      next: (res) => {
        if (res.data) {
          this.blacklists = res.data;
          this.spinner.hide();
        } else if (res.errorMessages) {
          res.errorMessages.forEach((error) => {
            this.swal.callToast(error, 'error');
            this.spinner.hide();
          });
        }
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
        this.spinner.hide();
      },
    });
  }

  deleteBlacklist(blacklist: BlacklistModel) {
    if (blacklist) {
      this.swal.callSwal(
        'Remove User',
        `Are you sure you want to remove this user from blacklist?`,
        'Remove',
        'Cancel',
        'question',
        () => {
          this.spinner.show();

          this.http
            .post<BlacklistModel>('Blacklists/Delete', `id=${blacklist.id}`)
            .subscribe({
              next: (res) => {
                if (res.successMessage) {
                  this.swal.callToast(res.successMessage);
                  this.getBlacklist();
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
