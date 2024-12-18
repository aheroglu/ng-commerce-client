import { Component } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { SwalService } from '../../services/swal.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterLink, RouterOutlet, RouterLinkActive],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent {
  constructor(private swal: SwalService, private router: Router) {}

  changeColorMode() {
    const activeTheme = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', activeTheme ? 'dark' : 'light');
  }

  signOut() {
    this.swal.callSwal(
      'Sign Out',
      'Are you sure you want to sign out?',
      'Sign Out',
      'Cancel',
      'question',
      () => {
        localStorage.removeItem('access-token');
        this.swal.callToast('Signed Out', 'info');
        this.router.navigateByUrl('/');
      }
    );
  }
}
