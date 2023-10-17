import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../services/auth-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private authSubscription: Subscription;

  userAuthenticated = false;

  constructor(private authService: AuthService) { }


  ngOnInit(): void {
    this.userAuthenticated = this.authService.getIsAuthenticated();
    this.authSubscription = this.authService.getAuthSubject().subscribe(status => {
      this.userAuthenticated = status;
    })
  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }
}
