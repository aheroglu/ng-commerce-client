import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SignInModel } from '../../../models/signin.model';
import { HttpService } from '../../../services/http.service';
import { SwalService } from '../../../services/swal.service';
import { FormsModule, NgForm } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [RouterLink, NgxSpinnerModule, FormsModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css',
})
export class SigninComponent {
  model: SignInModel = new SignInModel();

  constructor(
    private http: HttpService,
    private swal: SwalService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}

  signIn(form: NgForm) {
    if (form.valid) {
      this.spinner.show();

      this.http.post<SignInModel>('Auth/SignIn', null, this.model).subscribe({
        next: (res) => {
          if (res.successMessage) {
            form.resetForm();
            localStorage.setItem('access-token', res.successMessage);
            this.swal.callToast('Welcome!');
            this.router.navigateByUrl('/');
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
