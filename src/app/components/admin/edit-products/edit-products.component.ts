import { Component } from '@angular/core';
import { ProductModel } from '../../../models/product.model';
import { HttpService } from '../../../services/http.service';
import { FormsModule, NgForm } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { SwalService } from '../../../services/swal.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { CategoryModel } from '../../../models/category.model';
import { BrandModel } from '../../../models/brand.model';
import { ProductImageModel } from '../../../models/product-image.model';
import { productsImageUrl } from '../../../constants';

@Component({
  selector: 'app-edit-products',
  standalone: true,
  imports: [FormsModule, NgxSpinnerModule, CommonModule, NgxPaginationModule],
  templateUrl: './edit-products.component.html',
  styleUrl: './edit-products.component.css',
})
export class EditProductsComponent {
  products: ProductModel[] = [];
  categories: CategoryModel[] = [];
  brands: BrandModel[] = [];

  createModel: ProductModel = new ProductModel();
  updateModel: ProductModel = new ProductModel();
  selectedProduct: ProductModel = new ProductModel();
  currentProductImages: ProductImageModel[] = [];

  image: any;

  page: number = 1;
  isCreateModalOpen: boolean = false;
  isUpdateModalOpen: boolean = false;
  isDetailsModalOpen: boolean = false;
  isImageUploadModalOpen: boolean = false;
  imageUrl: string | null = productsImageUrl;
  productIdForImageUpload: string = '';

  constructor(
    private http: HttpService,
    private spinner: NgxSpinnerService,
    private swal: SwalService
  ) {
    this.getProducts();
  }

  getProducts() {
    this.spinner.show();

    this.http.post<ProductModel[]>('Products/GetAll').subscribe({
      next: (res) => {
        if (res.data) {
          this.products = res.data;
          this.getBrands();
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

  createProduct(form: NgForm) {
    if (form.valid) {
      this.spinner.show();

      this.http
        .post<ProductModel>('Products/Create', null, this.createModel)
        .subscribe({
          next: (res) => {
            if (res.successMessage) {
              this.swal.callToast(res.successMessage);
              form.resetForm();
              this.isCreateModalOpen = false;
              this.getProducts();
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

  deleteProduct(product: ProductModel) {
    if (product) {
      this.swal.callSwal(
        'Delete Product',
        `Are you sure you want to delete ${product.name} product? This operation cannot be undone.`,
        'Delete',
        'Cancel',
        'question',
        () => {
          this.spinner.show();

          this.http
            .post<ProductModel>('Products/Delete', `id=${product.id}`)
            .subscribe({
              next: (res) => {
                if (res.successMessage) {
                  this.swal.callToast(res.successMessage);
                  this.getProducts();
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

  getProduct(operation?: string, product?: ProductModel) {
    if (operation === 'update') {
      if (product) {
        this.updateModel = { ...product };
        this.isUpdateModalOpen = true;
      }
    } else if (operation === 'image') {
      this.updateModel = { ...product! };
      this.isImageUploadModalOpen = true;
    }
  }

  updateProduct(form: NgForm) {
    if (form.valid) {
      this.spinner.show();

      this.http
        .post<ProductModel>('Products/Update', null, this.updateModel)
        .subscribe({
          next: (res) => {
            if (res.successMessage) {
              this.swal.callToast(res.successMessage);
              form.resetForm();
              this.isUpdateModalOpen = false;
              this.getProducts();
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

  updateUrlHandle(model: string): void {
    if (model === 'create') {
      this.createModel.url = this.createModel.name
        .toLowerCase()
        .replace(/ç/g, 'c')
        .replace(/ğ/g, 'g')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ş/g, 's')
        .replace(/ü/g, 'u')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    } else if (model === 'update') {
      this.updateModel.url = this.updateModel.name
        .toLowerCase()
        .replace(/ç/g, 'c')
        .replace(/ğ/g, 'g')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ş/g, 's')
        .replace(/ü/g, 'u')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }
  }

  setImage(modal: string, event: any) {
    if (modal === 'create') {
      this.image = event.target.files[0];
    } else if (modal === 'update') {
      this.image = event.target.files[0];
    }
  }

  getProductImages(productId: string) {
    this.spinner.show();

    this.http.post<ProductImageModel[]>('ProductImages/GetAllByProduct', `productId=${productId}`).subscribe({
      next: res => {
        if (res.data) {
          this.currentProductImages = res.data;
          this.spinner.hide();
        } else if (res.errorMessages) {
          res.errorMessages.forEach(error => {
            this.swal.callToast(error, 'error');
          });
          this.spinner.hide();
        }
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
        this.spinner.hide();
      }
    })
  }

  createProductImage(form: NgForm) {
    if (form.valid) {
      this.spinner.show();

      const formData = new FormData();
      formData.append('image', this.image, this.image.name);
      formData.append('productId', this.productIdForImageUpload);

      this.http.post<ProductImageModel>('ProductImages/Create', null, formData).subscribe({
        next: res => {
          if (res.successMessage) {
            this.swal.callToast(res.successMessage);
            this.image = null;
            this.getProductImages(this.productIdForImageUpload);
            this.getProducts();
          } else if (res.errorMessages) {
            res.errorMessages.forEach(error => {
              this.swal.callToast(error, 'error');
            });
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

  deleteProductImage(productImage: ProductImageModel) {
    if (productImage) {
      this.swal.callSwal('Delete Product Image', 'Are you sure you want to delete this image?', 'Delete', 'Cancel', 'question', () => {
        this.spinner.show();

        this.http.post<ProductImageModel>('ProductImages/Delete', `id=${productImage.id}`).subscribe({
          next: res => {
            if (res.successMessage) {
              this.swal.callToast(res.successMessage);
              this.getProductImages(this.productIdForImageUpload);
              this.getProducts();
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
      })
    }
  }

  openModal(modal: string, product?: ProductModel) {
    if (modal === 'create') {
      this.isCreateModalOpen = true;
    } else if (modal === 'update') {
      this.isUpdateModalOpen = true;
    } else if (modal === 'details') {
      this.isDetailsModalOpen = true;
    } else if (modal === 'image') {
      this.isImageUploadModalOpen = true;
      this.productIdForImageUpload = product!.id;
      this.getProductImages(product!.id);
    }
  }

  closeModal(modal: string) {
    if (modal === 'create') {
      this.isCreateModalOpen = false;
    } else if (modal === 'update') {
      this.isUpdateModalOpen = false;
    } else if (modal === 'details') {
      this.isDetailsModalOpen = false;
    } else if (modal === 'image') {
      this.isImageUploadModalOpen = false;
    }
  }

  showProductDetails(product: ProductModel) {
    this.selectedProduct = product;
    this.isDetailsModalOpen = true;
  }

  closeDetailsModal() {
    this.isDetailsModalOpen = false;
    this.selectedProduct = new ProductModel();
  }
}
