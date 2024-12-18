import { Component } from '@angular/core';
import { BrandModel } from '../../../models/brand.model';
import { HttpService } from '../../../services/http.service';
import { SwalService } from '../../../services/swal.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-edit-brands',
  standalone: true,
  imports: [NgxSpinnerModule, CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './edit-brands.component.html',
  styleUrl: './edit-brands.component.css',
})
export class EditBrandsComponent {
  brands: BrandModel[] = [];
  createModel: BrandModel = new BrandModel();
  updateModel: BrandModel = new BrandModel();

  page: number = 1;

  isCreateModalOpen: boolean = false;
  isUpdateModalOpen: boolean = false;

  constructor(
    private http: HttpService,
    private swal: SwalService,
    private spinner: NgxSpinnerService
  ) {
    this.getBrands();
  }

  getBrands() {
    this.spinner.show();

    this.http.post<BrandModel[]>('Brands/GetAll').subscribe({
      next: (res) => {
        if (res.data) {
          this.brands = res.data;
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

  createBrand(form: NgForm) {
    if (form.valid) {
      this.spinner.show();

      this.http
        .post<BrandModel>('Brands/Create', null, this.createModel)
        .subscribe({
          next: (res) => {
            if (res.successMessage) {
              this.swal.callToast(res.successMessage);
              form.resetForm();
              this.isCreateModalOpen = false;
              this.getBrands();
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

  deleteBrand(brand: BrandModel) {
    if (brand) {
      this.swal.callSwal(
        'Delete Brand',
        `Are you sure you want to delete ${brand.name} brand?`,
        'Delete',
        'Cancel',
        'question',
        () => {
          this.spinner.show();

          this.http
            .post<BrandModel>('Brands/Delete', `id=${brand.id}`)
            .subscribe({
              next: (res) => {
                if (res.successMessage) {
                  this.swal.callToast(res.successMessage);
                  this.getBrands();
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

  getBrand(brand: BrandModel) {
    if (brand) {
      this.updateModel = { ...brand };
    }
  }

  updateBrand(form: NgForm) {
    if (form.valid) {
      this.spinner.show();

      this.http
        .post<BrandModel>('Brands/Update', null, this.updateModel)
        .subscribe({
          next: (res) => {
            if (res.successMessage) {
              this.swal.callToast(res.successMessage);
              form.resetForm();
              this.isUpdateModalOpen = false;
              this.getBrands();
            }
          },
          error: (err: HttpErrorResponse) => {
            console.log(err);
            this.spinner.hide();
          },
        });
    }
  }

  openModal(modal: string) {
    if (modal === 'create') {
      this.isCreateModalOpen = true;
    } else if (modal === 'update') {
      this.isUpdateModalOpen = true;
    }
  }

  closeModal(modal: string) {
    if (modal === 'create') {
      this.isCreateModalOpen = false;
    } else if (modal === 'update') {
      this.isUpdateModalOpen = false;
    }
  }
}
