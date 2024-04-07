import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { GeneralApiService } from '../../services/general-api.service';
import { UserProfileInterface } from '../../../interfaces/userInterfaces';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  authService = inject(AuthService);
  currentUserProfile: UserProfileInterface | undefined;

  constructor(private apiService: GeneralApiService) {}

  ngOnInit(): void {
    this.apiService.getUserProfile().subscribe(
      (response: any) => {
        this.currentUserProfile = response;
      }
    )
  }

  onLogout() {
    this.authService.logout();
  }
}
