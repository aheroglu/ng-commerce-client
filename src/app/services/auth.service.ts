import { Injectable } from '@angular/core';
import { UserModel } from '../models/user.model';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { SwalService } from './swal.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  token: string = '';
  user: UserModel = new UserModel();

  constructor(private router: Router, private swal: SwalService) {}

  isAuthenticated() {
    this.token = localStorage.getItem('access-token') ?? '';
    if (this.token === '') {
      localStorage.removeItem('access-token');
      return false;
    }

    const decode: JwtPayload | any = jwtDecode(this.token);
    const exp = decode.exp;
    const now = new Date().getTime() / 1000;

    if (now > exp) {
      localStorage.removeItem('access-token');
      return false;
    }

    this.user.id = decode['Id'];
    this.user.userName = decode['UserName'];
    this.user.fullName = decode['FullName'];
    this.user.email = decode['Email'];
    this.user.role = decode['Role'];

    return true;
  }

  isAdmin(): boolean {
    const role: string | null = this.user.role;

    if (role === 'Admin') {
      return true;
    } else {
      this.swal.callToast('Please sign in as an Admin!', 'warning');
      this.router.navigateByUrl('/');
      return false;
    }
  }
}
