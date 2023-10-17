import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AuthModel } from "./auth-model";
import { Subject } from "rxjs";

@Injectable({ providedIn: "root" })

export class AuthService {

    private token: string;
    private authSubject = new Subject<boolean>();
    isAuthenticated = false;


    getIsAuthenticated() {
        return this.isAuthenticated;
    }

    getAuthSubject() {
        return this.authSubject;
    }

    getToken() {
        return this.token;
    }

    constructor(private http: HttpClient, private router: Router) { }

    signupUser(username: string, password: string) {

        const authData: AuthModel = { username: username, password: password };

        this.http.post('http://localhost:5000/sign-up/', authData).subscribe(res => {
            console.log(res);
        })
    }

    loginUser(username: string, password: string) {

        const authData: AuthModel = { username: username, password: password };

        this.http.post<{ token: string, expiresIn: number }>('http://localhost:5000/login/', authData)
            .subscribe(res => {
                this.token = res.token;
                if (this.token) {
                    this.authSubject.next(true);
                    this.isAuthenticated = true;
                    this.router.navigate(['/']);
                }
            })
    }

    logout() {
        this.token = '';
        this.isAuthenticated = false;
        this.authSubject.next(false);
        this.router.navigate(['/']);

    }
}
