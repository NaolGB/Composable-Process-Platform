import { Routes } from '@angular/router';
import { DesignMasterHomeComponent } from './design/master_data_type/design-master-home/design-master-home.component';
import { LoginComponent } from './general/user/login/login.component';
import { ProfileComponent } from './general/user/profile/profile.component';

export const routes: Routes = [
    {path: 'design/master-data-type', component: DesignMasterHomeComponent, pathMatch: 'full'},
    {path: 'profile', component: ProfileComponent, pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
];
