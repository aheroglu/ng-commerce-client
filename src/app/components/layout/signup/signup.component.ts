import { HomeComponent } from './../home/home.component';
import { HttpErrorResponse, HttpSentEvent } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpService } from '../../../services/http.service';
import { SignUpModel } from '../../../models/signup.model';
import { FormsModule, NgForm } from '@angular/forms';
import { SwalService } from '../../../services/swal.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterLink, FormsModule, NgxSpinnerModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  model: SignUpModel = new SignUpModel();

  constructor(
    private http: HttpService,
    private swal: SwalService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}

  signUp(form: NgForm) {
    if (form.valid) {
      this.spinner.show();

      this.http.post<SignUpModel>('Auth/SignUp', null, this.model).subscribe({
        next: (res) => {
          if (res.successMessage) {
            this.swal.callToast(res.successMessage);
            this.router.navigateByUrl('/signin');
            this.spinner.hide();
          }
        },
        error: (err: HttpErrorResponse) => {
          if (err.error.ErrorMessages) {
            err.error.ErrorMessages.forEach((error: any) => {
              this.swal.callToast(error, 'error');
            });
          }
          this.spinner.hide();
        },
      });
    }
  }
}
