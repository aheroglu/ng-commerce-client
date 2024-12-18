import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpService } from '../../../services/http.service';
import { AuthService } from '../../../services/auth.service';
import { AddressModel } from '../../../models/address.model';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { CartItemModel } from '../../../models/cart-item.model';
import { SwalService } from '../../../services/swal.service';
import { CreditCardModel } from '../../../models/credit-card.model';
import { OrderModel } from '../../../models/order.model';
import { OrderItemModel } from '../../../models/order-item.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, NgxSpinnerModule, FormsModule],
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent {
  cartItems: CartItemModel[] = [];
  addresses: AddressModel[] = [];
  creditCards: CreditCardModel[] = [];

  createAddressModel: AddressModel = new AddressModel();
  createdCreditCardModel: CreditCardModel = new CreditCardModel();
  updateCreditCardModel: CreditCardModel = new CreditCardModel();

  isCreateAddressModalOpen: boolean = false;
  isCreateCreditCardModalOpen: boolean = false;
  isUpdateCreditCardModalOpen: boolean = false;

  currentStep = 1;
  selectedAddress: AddressModel = new AddressModel();
  selectedCreditCard: CreditCardModel = new CreditCardModel();
  cities: any;
  districts: any;
  selectedCity: string = '';

  constructor(
    private http: HttpService,
    private httpClient: HttpClient,
    public auth: AuthService,
    private spinner: NgxSpinnerService,
    private swal: SwalService,
    private router: Router
  ) {
    this.getCartItems();
    this.getAddresses();
    this.getCreditCards();
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

  async createOrder() {
    if (!this.selectedAddress.id || !this.selectedCreditCard.id) {
      this.swal.callToast(
        'Please select delivery address and credit card',
        'error'
      );
      return;
    }

    try {
      this.spinner.show();

      // 1. Create Order
      const order = {
        appUserId: this.auth.user.id,
        addressId: this.selectedAddress.id,
        creditCardId: this.selectedCreditCard.id,
        orderStatus: 1,
        totalPrice:
          this.calculateSubtotal() > 25
            ? this.calculateSubtotal()
            : this.calculateSubtotal() + 25,
      };

      const orderResponse = await this.http
        .post<OrderModel>('Orders/Create', null, order)
        .toPromise();

      if (!orderResponse?.successMessage) {
        throw new Error('Order creation failed');
      }

      const orderId = orderResponse.successMessage;
      console.log('Order created with ID:', orderId);

      // 2. Create Order Items in parallel
      const orderItemPromises = this.cartItems.map((cartItem) => {
        const orderItem = {
          orderId: orderId,
          productId: cartItem.product.id,
          quantity: cartItem.quantity,
          totalPrice: cartItem.product.price * cartItem.quantity,
        };
        console.log('Creating OrderItem:', orderItem);
        return this.http
          .post<OrderItemModel>('OrderItems/Create', null, orderItem)
          .toPromise();
      });

      await Promise.all(orderItemPromises);
      console.log('All OrderItems created successfully');

      // 3. Clear Cart
      await this.http
        .post('CartItems/Clear', `appUserId=${this.auth.user.id}`)
        .toPromise();
      console.log('Cart cleared successfully');

      this.spinner.hide();
      this.swal.callToast('Order placed successfully', 'success');
      this.router.navigate(['/orders']);
    } catch (error) {
      console.error('Order creation error:', error);
      this.spinner.hide();
      this.swal.callToast(
        'An error occurred while creating the order',
        'error'
      );
    }
  }

  selectAddress(address: AddressModel) {
    if (address) {
      this.selectedAddress = address;
    }
  }

  selectCard(creditCard: CreditCardModel) {
    if (creditCard) {
      this.selectedCreditCard = creditCard;
    }
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
      this.createdCreditCardModel.appUserId = this.auth.user.id;

      this.http
        .post<CreditCardModel>(
          'CreditCards/Create',
          null,
          this.createdCreditCardModel
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

  nextStep() {
    if (this.currentStep === 1 && !this.selectedAddress.id) {
      this.swal.callToast('Please select a delivery address', 'error');
      return;
    }

    if (this.currentStep === 2 && !this.selectedCreditCard.id) {
      this.swal.callToast('Please select a payment method', 'error');
      return;
    }

    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
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
    if (modal === 'createAddress') {
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
    } else if (modal === 'createCreditCard') {
      this.isCreateCreditCardModalOpen = true;
    }
  }

  closeModal(modal: string) {
    if (modal === 'createCreditCard') {
      this.isCreateCreditCardModalOpen = false;
    } else if (modal === 'create-address') {
      this.isCreateAddressModalOpen = false;
    }
  }
}
