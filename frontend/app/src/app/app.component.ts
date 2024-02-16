import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'model';

  expandNavbar = false

  constructor(private router: Router) {}

  toggleNavbar() {
    this.expandNavbar = !this.expandNavbar
  }

  navigateTo(route: string): void {
    this.router.navigateByUrl(route);
}
}
