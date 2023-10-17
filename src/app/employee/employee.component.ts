import { Component, OnDestroy, OnInit } from '@angular/core';
import { EmployeeDataService } from '../services/employee-data.component';
import { Employee } from '../services/employee.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit, OnDestroy {

  employees: Employee[];
  employeeSubscription = new Subscription();
  private authSubscription: Subscription;
  isAuthenticated = false;


  constructor(private employeeDataService: EmployeeDataService, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {

    this.employeeDataService.getEmployeeData();
    this.employeeSubscription = this.employeeDataService.employeeSubject.subscribe(data => {
      this.employees = data;
    })

    this.authSubscription = this.authService.getAuthSubject().subscribe(status => {
      this.isAuthenticated = status;
    })
    this.isAuthenticated = this.authService.getIsAuthenticated();

  }

  ngOnDestroy(): void {
    this.employeeSubscription.unsubscribe();
    this.authSubscription.unsubscribe();
  }
  onDelete(id: string) {
    this.employeeDataService.onDeleteData(id);
  }

  onEdit(id: string) {
    this.router.navigate(["edit", id])
  }


}
