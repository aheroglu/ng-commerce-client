import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'admin',
    loadComponent: () =>
      import('./components/admin/admin.component').then(
        (m) => m.AdminComponent
      ),
    canActivate: [
      () =>
        inject(AuthService).isAuthenticated() && inject(AuthService).isAdmin(),
    ],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/admin/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./components/admin/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'products',
        loadComponent: () =>
          import(
            './components/admin/edit-products/edit-products.component'
          ).then((m) => m.EditProductsComponent),
      },
      {
        path: 'categories',
        loadComponent: () =>
          import(
            './components/admin/edit-categories/edit-categories.component'
          ).then((m) => m.EditCategoriesComponent),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./components/admin/edit-users/edit-users.component').then(
            (m) => m.EditUsersComponent
          ),
      },
      {
        path: 'blacklist',
        loadComponent: () =>
          import('./components/admin/blacklist/blacklist.component').then(
            (m) => m.BlacklistComponent
          ),
      },
      {
        path: 'brands',
        loadComponent: () =>
          import('./components/admin/edit-brands/edit-brands.component').then(
            (m) => m.EditBrandsComponent
          ),
      },
    ],
  },
  {
    path: '',
    loadComponent: () =>
      import('./components/layout/layout.component').then(
        (m) => m.LayoutComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/layout/home/home.component').then(
            (m) => m.HomeComponent
          ),
      },
      {
        path: 'home',
        loadComponent: () =>
          import('./components/layout/home/home.component').then(
            (m) => m.HomeComponent
          ),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./components/layout/products/products.component').then(
            (m) => m.ProductsComponent
          ),
      },
      {
        path: 'product/:url',
        loadComponent: () =>
          import('./components/layout/product/product.component').then(
            (m) => m.ProductComponent
          ),
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./components/layout/contact/contact.component').then(
            (m) => m.ContactComponent
          ),
      },
      {
        path: 'signin',
        loadComponent: () =>
          import('./components/layout/signin/signin.component').then(
            (m) => m.SigninComponent
          ),
      },
      {
        path: 'signup',
        loadComponent: () =>
          import('./components/layout/signup/signup.component').then(
            (m) => m.SignupComponent
          ),
      },
      {
        path: 'profile',
        canActivate: [() => inject(AuthService).isAuthenticated()],
        loadComponent: () =>
          import('./components/layout/profile/profile.component').then(
            (m) => m.ProfileComponent
          ),
      },
      {
        path: 'favourites',
        canActivate: [() => inject(AuthService).isAuthenticated()],
        loadComponent: () =>
          import('./components/layout/favourites/favourites.component').then(
            (m) => m.FavouritesComponent
          ),
      },
      {
        path: 'cart',
        canActivate: [() => inject(AuthService).isAuthenticated()],
        loadComponent: () =>
          import('./components/layout/cart/cart.component').then(
            (m) => m.CartComponent
          ),
      },
      {
        path: 'checkout',
        canActivate: [() => inject(AuthService).isAuthenticated()],
        loadComponent: () =>
          import('./components/layout/checkout/checkout.component').then(
            (m) => m.CheckoutComponent
          ),
      },
      {
        path: 'orders',
        canActivate: [() => inject(AuthService).isAuthenticated()],
        loadComponent: () =>
          import('./components/layout/orders/orders.component').then(
            (m) => m.OrdersComponent
          ),
      },
      {
        path: 'order/:orderId',
        canActivate: [() => inject(AuthService).isAuthenticated()],
        loadComponent: () =>
          import('./components/layout/order-detail/order-detail.component').then(
            (m) => m.OrderDetailComponent
          ),
      },
      {
        path: '**',
        loadComponent: () =>
          import('./components/error/error.component').then(
            (m) => m.ErrorComponent
          ),
      },
    ],
  },
];
