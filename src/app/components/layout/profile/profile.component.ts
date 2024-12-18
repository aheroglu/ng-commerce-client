import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { NewsletterModel } from '../../../models/newsletter.model';
import { UserModel } from '../../../models/user.model';
import { AuthService } from '../../../services/auth.service';
import { HttpService } from '../../../services/http.service';
import { SwalService } from '../../../services/swal.service';
import { AddressModel } from '../../../models/address.model';
import { CommonModule } from '@angular/common';
import { CreditCardModel } from '../../../models/credit-card.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, NgxSpinnerModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  profileModel: UserModel = new UserModel();
  passwordModel: UserPasswordModel = new UserPasswordModel();
  createAddressModel: AddressModel = new AddressModel();
  updateAddressModel: AddressModel = new AddressModel();
  createCreditCardModel: CreditCardModel = new CreditCardModel();

  addresses: AddressModel[] = [];
  creditCards: CreditCardModel[] = [];
  cities: any;
  districts: any;
  selectedCity: string = '';

  isEmailSubscribed: boolean = false;
  isCreateAddressModalOpen: boolean = false;
  isCreateCreditCardModalOpen: boolean = false;
  isUpdateCreditCardModalOpen: boolean = false;

  emailForDeleteAccount: string = '';

  constructor(
    private http: HttpService,
    private swal: SwalService,
    private router: Router,
    private auth: AuthService,
    private spinner: NgxSpinnerService,
    private httpClient: HttpClient
  ) {
    this.loadUserProfile();
  }

  ngOnInit(): void {
    this.checkNewsletterSubscription();
  }

  loadUserProfile() {
    this.spinner.show();

    this.http
      .post<UserModel>('Users/GetById', `appUserId=${this.auth.user.id}`)
      .subscribe({
        next: (res) => {
          if (res.data) {
            this.profileModel = res.data;

            this.profileModel.id = this.auth.user.id;
            this.passwordModel.appUserId = this.auth.user.id;

            this.getAddresses();
            this.getCreditCards();
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

  getAddresses() {
    this.spinner.show();

    this.http
      .post<AddressModel[]>(
        'Addresses/GetAllByUser',
        `appUserId=${this.auth.user.id}`
      )
      .subscribe({
        next: (res) => {
          if (res.data) {
            this.addresses = res.data;
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

  getCreditCards() {
    this.spinner.show();

    this.http
      .post<CreditCardModel[]>(
        'CreditCards/GetAllByUser',
        `appUserId=${this.auth.user.id}`
      )
      .subscribe({
        next: (res) => {
          if (res.data) {
            this.creditCards = res.data;
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

  createAddress(form: NgForm) {
    if (form.valid) {
      this.spinner.show();
      this.createAddressModel.appUserId = this.auth.user.id;

      this.http
        .post<AddressModel>('Addresses/Create', null, this.createAddressModel)
        .subscribe({
          next: (res) => {
            if (res.successMessage) {
              this.swal.callToast(res.successMessage);
              this.isCreateAddressModalOpen = false;
              this.getAddresses();
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

  deleteAddress(address: AddressModel) {
    if (address) {
      this.swal.callSwal(
        'Delete Address',
        'Are you sure you want to delete this address?',
        'Delete',
        'Cancel',
        'question',
        () => {
          this.spinner.show();

          this.http
            .post<AddressModel>('Addresses/Delete', `id=${address.id}`)
            .subscribe({
              next: (res) => {
                if (res.successMessage) {
                  this.swal.callToast(res.successMessage);
                  this.getAddresses();
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

  createCreditCard(form: NgForm) {
    if (form.valid) {
      this.spinner.show();
      this.createCreditCardModel.appUserId = this.auth.user.id;

      this.http
        .post<CreditCardModel>(
          'CreditCards/Create',
          null,
          this.createCreditCardModel
        )
        .subscribe({
          next: (res) => {
            if (res.successMessage) {
              this.swal.callToast(res.successMessage);
              this.isCreateCreditCardModalOpen = false;
              this.spinner.hide();
              this.getCreditCards();
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

  deleteCreditCard(creditCard: CreditCardModel) {
    if (creditCard) {
      this.swal.callSwal(
        'Delete Credit Card',
        'Are you sure you want to delete this credit card?',
        'Delete',
        'Cancel',
        'question',
        () => {
          this.spinner.show();

          this.http
            .post<CreditCardModel>('CreditCards/Delete', `id=${creditCard.id}`)
            .subscribe({
              next: (res) => {
                if (res.successMessage) {
                  this.swal.callToast(res.successMessage);
                  this.getCreditCards();
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

  checkNewsletterSubscription() {
    this.spinner.show();

    const data = {
      email: this.auth.user.email,
    };

    this.http
      .post<NewsletterModel>('Newsletters/CheckSubscription', null, data)
      .subscribe({
        next: (res) => {
          if (res.data) {
            this.isEmailSubscribed = true;
          } else {
            this.isEmailSubscribed = false;
          }
          this.spinner.hide();
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
          this.spinner.hide();
        },
      });
  }

  updateProfile(form: NgForm) {
    if (form.valid) {
      this.spinner.show();

      this.http
        .post<UserModel>('Profile/UpdateProfile', null, this.profileModel)
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
          error: (err: HttpErrorResponse) => {
            console.log(err);
            this.spinner.hide();
          },
        });
    }
  }

  updatePassword(form: NgForm) {
    if (form.valid) {
      this.spinner.show();

      this.http
        .post<UserPasswordModel>(
          'Profile/UpdatePassword',
          null,
          this.passwordModel
        )
        .subscribe({
          next: (res) => {
            if (res.successMessage) {
              this.swal.callToast(res.successMessage);
              localStorage.removeItem('access-token');
              this.router.navigateByUrl('/signin');
              this.spinner.hide();
            } else if (res.errorMessages) {
              res.errorMessages.forEach((error) => {
                this.swal.callToast(error, 'error');
              });
              this.spinner.hide();
            }
          },
          error: (err: HttpErrorResponse) => {
            if (err.error.ErrorMessages) {
              err.error.ErrorMessages.forEach((error: any) => {
                this.swal.callToast(error, 'error');
              });
              this.spinner.hide();
            }
            console.log(err);
            this.spinner.hide();
          },
        });
    }
  }

  subscriberNewsletter() {
    this.swal.callSwal(
      'Subscribe Newsletter',
      undefined,
      'Subscribe',
      'Cancel',
      'info',
      () => {
        this.spinner.show();

        const model = {
          email: this.auth.user.email,
        };

        this.http
          .post<NewsletterModel>('Newsletters/Create', null, model)
          .subscribe({
            next: (res) => {
              if (res.successMessage) {
                this.swal.callToast(res.successMessage);
                this.checkNewsletterSubscription();
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

  unsubscribeNewsletter() {
    this.swal.callSwal(
      'Unsubscribe Newsletter',
      undefined,
      'Unsubscribe',
      'Cancel',
      'info',
      () => {
        this.spinner.show();

        this.http
          .post<NewsletterModel>(
            'Newsletters/Delete',
            `email=${this.auth.user.email}`
          )
          .subscribe({
            next: (res) => {
              if (res.successMessage) {
                this.swal.callToast(res.successMessage);
                this.checkNewsletterSubscription();
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

  deleteAccount(form: NgForm) {
    if (form.valid) {
      this.swal.callSwal(
        'Delete Account',
        'Are you sure you want to delete your NG-Commerce account?',
        'Delete',
        'Cancel',
        'question',
        () => {
          this.spinner.show();

          if (this.emailForDeleteAccount != this.auth.user.email) {
            this.swal.callToast(
              'Emails are not match. Please enter your valid email address.',
              'warning'
            );
            this.spinner.hide();
            return;
          }

          this.http
            .post<UserModel>(
              'Users/Delete',
              `email=${this.emailForDeleteAccount}`
            )
            .subscribe({
              next: (res) => {
                if (res.successMessage) {
                  this.swal.callToast(res.successMessage);
                  localStorage.removeItem('access-token');
                  this.router.navigateByUrl('/');
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
      );
    }
  }

  loadDistricts() {
    if (this.createAddressModel.city) {
      this.spinner.show();

      this.httpClient
        .get(
          `https://turkiyeapi.dev/api/v1/provinces?name=${this.createAddressModel.city}`
        )
        .subscribe({
          next: (res: any) => {
            this.districts = res.data[0].districts;
            this.spinner.hide();
          },
          error: (err: HttpErrorResponse) => {
            console.log(err);
            this.spinner.hide();
          },
        });
    }
  }

  openModal(modal: string) {
    if (modal === 'create-address') {
      this.spinner.show();
      this.httpClient.get('https://turkiyeapi.dev/api/v1/provinces').subscribe({
        next: (res: any) => {
          this.cities = res.data.sort((a: any, b: any) =>
            a.name.localeCompare(b.name)
          );
          this.isCreateAddressModalOpen = true;
          this.spinner.hide();
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
          this.spinner.hide();
        },
      });
    } else if (modal === 'create-creditcard') {
      this.isCreateCreditCardModalOpen = true;
    }
  }

  closeModal(modal: string) {
    if (modal === 'create-address') {
      this.isCreateAddressModalOpen = false;
    } else if (modal === 'create-creditcard') {
      this.isCreateCreditCardModalOpen = false;
    } else if (modal === 'update-creditcard') {
      this.isUpdateCreditCardModalOpen = false;
    }
  }
}

export class UserPasswordModel {
  appUserId: string = '';
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
}
