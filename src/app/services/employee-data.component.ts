import { Injectable } from "@angular/core";
import { Employee } from "./employee.model";
import { Subject, map } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: "root" })

export class EmployeeDataService {

    public employeeSubject = new Subject<Employee[]>();

    private employees: Employee[] = [];

    public maxId: number;

    constructor(private http: HttpClient) { }

    onUpdataData(id: string, newData: Employee) {
        this.http.put<{ message: string }>('http://localhost:5000/update-data/' + id, newData).subscribe((jsonData) => {
            console.log(jsonData.message);
            this.getEmployeeData();
        })
    }

    onDeleteData(id: string) {
        this.http.delete<{ message: string }>('http://localhost:5000/remove-data/' + id).subscribe((jsonData) => {
            console.log(jsonData.message)
            this.getEmployeeData();
        })
    }

    getEmployeeData() {
        this.http.get<{ employees: any }>('http://localhost:5000/employee-data')
            .pipe(map((responseData) => {
                console.log(responseData)
                return responseData.employees.map((data: { firstName: string; lastName: string; email: string; phone: string; _id: string }) => {
                    return {
                        firstName: data.firstName,
                        lastName: data.lastName,
                        email: data.email,
                        phone: data.phone,
                        id: data._id,
                    }
                })

            }))
            .subscribe((updateResponse) => {
                this.employees = updateResponse;
                this.employeeSubject.next(this.employees);
            })
    }

    getData(id: string) {
        const index = this.employees.findIndex(el => {
            return el.id == id;
        })
        return this.employees[index]
    }

    onAddData(employee: Employee) {

        this.http.post<{ message: string }>('http://localhost:5000/add-data', employee).subscribe((jsonData) => {
            console.log(jsonData.message);
            this.getEmployeeData();
        })
    }
}