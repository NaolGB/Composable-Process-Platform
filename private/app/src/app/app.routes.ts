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
import { DesignProcessHomeComponent } from './design/process_type/design-process-home/design-process-home.component';
import { DesignProcessAddNewComponent } from './design/process_type/design-process-add-new/design-process-add-new.component';
import { OperationProcessHomeComponent } from './operation/process_instance/operation-process-home/operation-process-home.component';
import { OperationRequestHomeComponent } from './operation/operation_request/operation-request-home/operation-request-home.component';
import { AnalyticsHomeComponent } from './analytics/analytics-home/analytics-home.component';

export const routes: Routes = [
    {path: 'design/master-data-type', component: DesignMasterHomeComponent, canActivate: [authLoginGuard, permissionAnalystGuard], pathMatch: 'full'},
    {path: 'design/document-type', component: DesignDocumentHomeComponent, canActivate: [authLoginGuard, permissionAnalystGuard], pathMatch: 'full'},
    {path: 'design/process-type', component: DesignProcessHomeComponent, canActivate: [authLoginGuard, permissionAnalystGuard], pathMatch: 'full'},
    {path: 'design/process-type/add-new', component: DesignProcessAddNewComponent, canActivate: [authLoginGuard, permissionAnalystGuard], pathMatch: 'full'},
    {path: 'operation/process', component: OperationProcessHomeComponent, canActivate: [authLoginGuard, permissionBusinessUserGuard], pathMatch: 'full'},
    {path: 'operation/request', component: OperationRequestHomeComponent, canActivate: [authLoginGuard, permissionBusinessUserGuard], pathMatch: 'full'},
    {path: 'analytics', component: AnalyticsHomeComponent, canActivate: [authLoginGuard, permissionBusinessUserGuard], pathMatch: 'full'},
    {path: 'profile', component: ProfileComponent, canActivate: [authLoginGuard, permissionBusinessUserGuard], pathMatch: 'full'},
    {path: 'not-allowed', component: NotAllowedComponent, pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
];
