import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EmployeeDataService } from '../services/employee-data.component';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Employee } from '../services/employee.model';


@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css']
})
export class DataFormComponent implements OnInit {

  employeeForm: FormGroup;
  editMode: boolean = false;
  employee: Employee;
  private paramId: string;

  constructor(private employeeDataService: EmployeeDataService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.editMode = true;
        this.paramId = paramMap.get('id')!;
        this.employee = this.employeeDataService.getData(this.paramId);
      }
      else {
        this.editMode = false;
      }
    })

    this.employeeForm = new FormGroup({
      "firstName": new FormControl(this.editMode ? this.employee.firstName : null, [Validators.required]),
      "lastName": new FormControl(this.editMode ? this.employee.lastName : null, [Validators.required]),
      "email": new FormControl(this.editMode ? this.employee.email : null, [Validators.required]),
      "phone": new FormControl(this.editMode ? this.employee.phone : null, [Validators.required]),

    })
  }

  onSubmit() {
    const newData = new Employee('', this.employeeForm.value.firstName, this.employeeForm.value.lastName, this.employeeForm.value.email, this.employeeForm.value.phone);

    if (this.editMode) {
      newData.id = this.paramId;
      this.employeeDataService.onUpdataData(this.paramId, newData);
    } else {
      this.employeeDataService.onAddData(newData);
    }

    this.router.navigateByUrl("");
  }

}
