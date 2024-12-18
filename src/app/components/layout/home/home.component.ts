import { categoriesImageUrl } from './../../../constants';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpService } from '../../../services/http.service';
import { NewsletterModel } from '../../../models/newsletter.model';
import { FormsModule, NgForm } from '@angular/forms';
import { SwalService } from '../../../services/swal.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { HttpErrorResponse } from '@angular/common/http';
import { CategoryModel } from '../../../models/category.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, RouterLink, NgxSpinnerModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  categories: CategoryModel[] = [];
  newsletter: NewsletterModel = new NewsletterModel();

  image = categoriesImageUrl;

  activeTheme: string | null = '';

  constructor(
    private http: HttpService,
    private swal: SwalService,
    private spinner: NgxSpinnerService
  ) {
    this.getCategories();
  }

  ngOnInit(): void {
    this.activeTheme = localStorage.getItem('theme');
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

  signUpNewsletter(form: NgForm) {
    if (form.valid) {
      this.spinner.show();

      this.http
        .post<NewsletterModel>('Newsletters/Create', null, this.newsletter)
        .subscribe({
          next: (res) => {
            if (res.successMessage) {
              form.resetForm();
              this.swal.callToast(res.successMessage);
              this.spinner.hide();
            } else if (res.errorMessages && res.errorMessages.length > 0) {
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
}
