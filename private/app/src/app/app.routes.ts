import { Routes } from '@angular/router';
import { DesignMasterHomeComponent } from './design/master_data_type/design-master-home/design-master-home.component';
import { LoginComponent } from './general/user/login/login.component';
import { ProfileComponent } from './general/user/profile/profile.component';
import { authAnalystGuard } from './guards/auth-analyst.guard';
import { authLoginGuard } from './guards/auth-login.guard';
import { NotAllowedComponent } from './general/error-pages/not-allowed/not-allowed.component';

export const routes: Routes = [
    {path: 'design/master-data-type', component: DesignMasterHomeComponent, canActivate: [authLoginGuard, authAnalystGuard], pathMatch: 'full'},
    {path: 'profile', component: ProfileComponent, pathMatch: 'full'},
    {path: 'not-allowed', component: NotAllowedComponent, pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
];
