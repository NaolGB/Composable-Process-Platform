import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DesignMasterHomeComponent } from './design/master_data_type/design-master-home/design-master-home.component';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { LoginComponent } from './general/user/login/login.component';
import { UserProfile, idToken } from '@angular/fire/auth';
import { GeneralApiService } from './general/services/general-api.service';
import { UserProfileInterface } from './interfaces/userInterfaces';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    DesignMasterHomeComponent,
    LoginComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  authService = inject(AuthService);
  generalApiService = inject(GeneralApiService)
  navbarExpanded = false; 

  constructor(
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      if(user) {
        this.authService.currentUserSignal.set({
          email: user.email!,
        });
        user.getIdToken().then((idToken) => {
          this.authService.idTokenSignal.set(idToken);

          // needs to be inside the getIdToken promise to ensure the idToken is set
          this.generalApiService.getUserProfile().subscribe(
            (response: any) => {
              const userProfile: UserProfileInterface = response;
              this.authService.currentUserProfileSignal.set(userProfile);
            }
          )
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

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
