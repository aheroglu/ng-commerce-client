import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SwalService } from '../../services/swal.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent implements OnInit {
  currentYear: number;
  isAdmin: boolean = false;
  isMenuOpen: boolean = false;
  isUserMenuOpen: boolean = false;
  isMobileUserMenuOpen: boolean = false;
  offset: number = 0;

  constructor(
    public auth: AuthService,
    private swal: SwalService,
    private router: Router
  ) {
    this.currentYear = new Date().getFullYear();
  }
  ngOnInit(): void {
    // this.isAdmin = this.auth.isAdmin();
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isMenuOpen = false;
        this.isUserMenuOpen = false;
        this.isMobileUserMenuOpen = false;
      }
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.offset = window.scrollY;
  }

  menuToggle() {
    if (!this.isMenuOpen) {
      this.isMenuOpen = true;
    } else {
      this.isMenuOpen = false;
      this.isMobileUserMenuOpen = false;
    }
  }

  userMenuToggle() {
    if (!this.isUserMenuOpen) {
      this.isUserMenuOpen = true;
    } else {
      this.isUserMenuOpen = false;
    }
  }

  mobileUserMenuToggle() {
    if (!this.isMobileUserMenuOpen) {
      this.isMobileUserMenuOpen = true;
    } else {
      this.isMobileUserMenuOpen = false;
    }
  }

  changeColorMode() {
    const activeTheme = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', activeTheme ? 'dark' : 'light');
  }

  public signOut() {
    this.swal.callSwal(
      'Sign Out',
      'Are you sure you want to sign out?',
      'Sign Out',
      'Cancel',
      'question',
      () => {
        localStorage.removeItem('access-token');
        this.isMenuOpen = false;
        this.swal.callToast('Signed Out', 'info');
      }
    );
  }
}
