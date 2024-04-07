import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DesignMasterHomeComponent } from './design/master_data_type/design-master-home/design-master-home.component';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { LoginComponent } from './general/user/login/login.component';
import { idToken } from '@angular/fire/auth';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    DesignMasterHomeComponent,
    LoginComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  authService = inject(AuthService);
  navbarExpanded = false; 

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      if(user) {
        this.authService.currentUserSignal.set({
          email: user.email!,
        });
        user.getIdToken().then((idToken) => {
          this.authService.idTokenSignal.set(idToken);
        });
      } 
      else {
        this.authService.currentUserSignal.set(null);
      }
    });
  }
  
  toggleNavbar() {
    this.navbarExpanded = !this.navbarExpanded; 
  }
}
