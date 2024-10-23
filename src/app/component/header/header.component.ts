import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  sidebarVisible: boolean = false;
  user = JSON.parse(sessionStorage.getItem('user') as string);
  constructor(private router: Router) { }
  logout() {
    sessionStorage.clear();
    window.location.reload();
    window.location.href = '/login';
  }
}
