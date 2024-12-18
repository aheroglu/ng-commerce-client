import { Component, DebugEventListener } from '@angular/core';
import { UserModel } from '../../../models/user.model';
import { HttpService } from '../../../services/http.service';
import { SwalService } from '../../../services/swal.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { BlacklistModel } from '../../../models/blacklist.model';

@Component({
  selector: 'app-edit-users',
  standalone: true,
  imports: [CommonModule, NgxSpinnerModule, FormsModule],
  templateUrl: './edit-users.component.html',
  styleUrl: './edit-users.component.css',
})
export class EditUsersComponent {
  users: UserModel[] = [];
  model: BlacklistModel = new BlacklistModel();

  isModalOpen: boolean = false;

  constructor(
    private http: HttpService,
    private swal: SwalService,
    private spinner: NgxSpinnerService
  ) {
    this.getUsers();
  }

  getUsers() {
    this.spinner.show();

    this.http.post<UserModel[]>('Users/GetAllCustomers').subscribe({
      next: (res) => {
        if (res.data) {
          this.users = res.data;
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

  getUser(user: UserModel) {
    this.model.appUserId = user.id;
  }

  addToBlacklist(form: NgForm) {
    if (form.valid) {
      this.spinner.show();

      this.http
        .post<BlacklistModel>('Blacklists/Create', null, this.model)
        .subscribe({
          next: (res) => {
            if (res.successMessage) {
              form.resetForm();
              this.swal.callToast(res.successMessage);
              this.spinner.hide();
              this.isModalOpen = false;
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

  deleteUser(user: UserModel) {
    if (user) {
      this.swal.callSwal(
        'Delete User',
        `Are you sure you want to delete user ${user.fullName}?`,
        'Delete',
        'Cancel',
        'question',
        () => {
          this.spinner.show();

          this.http
            .post<UserModel>('Users/Delete', `email=${user.email}`)
            .subscribe({
              next: (res) => {
                if (res.successMessage) {
                  this.swal.callToast(res.successMessage);
                  this.getUsers();
                } else if (res.errorMessages) {
                  res.errorMessages.forEach((error) => {
                    this.swal.callToast(error);
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
      );
    }
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
