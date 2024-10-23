import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: false,
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {
  pesquisa = '';

  constructor(private router: Router) {
    const user = JSON.parse(sessionStorage.getItem('userAdmin') || '{}');

    if (user?.userData?.role !== 9) {
      router.navigate(['/login-adm']);
    }
  }

  logout() {
    sessionStorage.removeItem('userAdmin');
    this.router.navigate(['/login-adm']);
  }
}
