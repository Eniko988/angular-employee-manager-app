import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeComponent } from './employee/employee.component';
import { DataFormComponent } from './data-form/data-form.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { RouteGuard } from './services/route-guard';

const routes: Routes = [
  {path: '', component:  EmployeeComponent},
  {path: 'employee-data', component:  DataFormComponent,canActivate:[RouteGuard]},
  {path: 'edit/:id',component :DataFormComponent,canActivate:[RouteGuard]},
  {path: 'login',component: LoginComponent},
  {path: 'sign-up',component: SignUpComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [RouteGuard]
})
export class AppRoutingModule { }
