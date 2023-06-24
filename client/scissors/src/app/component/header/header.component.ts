import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user-service.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  userData: any;
  ngOnInit() {
    this.getAUser();
  }
  constructor(private route: Router, private http: UserService) {}
  signup() {
    this.route.navigate(['/signup']);
  }
  login() {
    this.route.navigate(['/login']);
  }
  home() {
    this.route.navigate(['/home']);
  }
  getAUser() {
    let userID = localStorage.getItem('userID');
    this.http.getUser(userID as string).subscribe(
      (response: any) => {
        this.userData = response.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
