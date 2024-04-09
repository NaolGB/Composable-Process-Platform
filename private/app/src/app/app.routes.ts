import { Routes } from '@angular/router';
import { DesignMasterHomeComponent } from './design/master_data_type/design-master-home/design-master-home.component';
import { LoginComponent } from './general/user/login/login.component';
import { ProfileComponent } from './general/user/profile/profile.component';
import { authLoginGuard } from './guards/auth-login.guard';
import { NotAllowedComponent } from './general/error-pages/not-allowed/not-allowed.component';
import { permissionAdminGuard } from './guards/permission-admin.guard';
import { permissionAnalystGuard } from './guards/permission-analyst.guard';
import { permissionBusinessUserGuard } from './guards/permission-business-user.guard';
import { DesignDocumentHomeComponent } from './design/document_type/design-document-home/design-document-home.component';

export const routes: Routes = [
    {path: 'design/master-data-type', component: DesignMasterHomeComponent, canActivate: [authLoginGuard, permissionAnalystGuard], pathMatch: 'full'},
    {path: 'design/document-type', component: DesignDocumentHomeComponent, canActivate: [authLoginGuard, permissionAnalystGuard], pathMatch: 'full'},
    {path: 'profile', component: ProfileComponent, canActivate: [authLoginGuard, permissionBusinessUserGuard], pathMatch: 'full'},
    {path: 'not-allowed', component: NotAllowedComponent, pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
];
