import { categoriesImageUrl } from './../../../constants';
import { Component } from '@angular/core';
import { CategoryModel } from '../../../models/category.model';
import { SwalService } from '../../../services/swal.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { HttpService } from '../../../services/http.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-edit-categories',
  standalone: true,
  imports: [NgxSpinnerModule, NgxPaginationModule, CommonModule, FormsModule],
  templateUrl: './edit-categories.component.html',
  styleUrl: './edit-categories.component.css',
})
export class EditCategoriesComponent {
  categories: CategoryModel[] = [];
  page: number = 1;
  createModel: CategoryModel = new CategoryModel();
  updateModel: CategoryModel = new CategoryModel();

  isCreateModalOpen: boolean = false;
  isUpdateModalOpen: boolean = false;

  image: string | null = categoriesImageUrl;

  constructor(
    private http: HttpService,
    private spinner: NgxSpinnerService,
    private swal: SwalService
  ) {
    this.getCategories();
  }

  getCategories() {
    this.spinner.show();

    this.http.post<CategoryModel[]>('Categories/GetAll').subscribe({
      next: (res) => {
        if (res.data) {
          this.categories = res.data;
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

  setImage(modal: string, event: any) {
    if (modal === 'create') {
      this.createModel.image = event.target.files[0];
    } else if (modal === 'update') {
      this.updateModel.image = event.target.files[0];
    }
  }

  createCategory(form: NgForm) {
    if (form.valid) {
      this.spinner.show();

      const formData = new FormData();
      formData.append('name', this.createModel.name);
      formData.append(
        'image',
        this.createModel.image,
        this.createModel.image.name
      );

      this.http
        .post<CategoryModel>('Categories/Create', null, formData)
        .subscribe({
          next: (res) => {
            if (res.successMessage) {
              form.resetForm();
              this.swal.callToast(res.successMessage);
              this.isCreateModalOpen = false;
              this.getCategories();
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

  getCategory(category: CategoryModel) {
    if (category) {
      this.updateModel = { ...category };
    }
  }

  updateCategory(form: NgForm) {
    if (form.valid) {
      this.spinner.show();

      const formData = new FormData();
      formData.append('id', this.updateModel.id);
      formData.append('name', this.updateModel.name);

      if (this.updateModel.image && this.updateModel.image instanceof File) {
        formData.append(
          'image',
          this.updateModel.image,
          this.updateModel.image.name
        );
      }

      this.http
        .post<CategoryModel>('Categories/Update', null, formData)
        .subscribe({
          next: (res) => {
            if (res.successMessage) {
              form.resetForm();
              this.isUpdateModalOpen = false;
              this.swal.callToast(res.successMessage);
              this.getCategories();
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

  deleteCategory(category: CategoryModel) {
    if (category) {
      this.swal.callSwal(
        'Delete Category',
        `Are you sure you want to delete ${category.name} category? This cannot be undone.`,
        'Delete',
        'Cancel',
        'question',
        () => {
          this.spinner.show();

          this.http
            .post<CategoryModel>('Categories/Delete', `id=${category.id}`)
            .subscribe({
              next: (res) => {
                if (res.successMessage) {
                  this.swal.callToast(res.successMessage);
                  this.getCategories();
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
