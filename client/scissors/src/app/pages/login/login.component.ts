import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user-service.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  isSubmitting: boolean = false;
  user = {
    user: '',
    password: '',
  };
  apiResponse: any;
  constructor(private http: UserService, private route: Router) {}
  async onSubmit() {
    this.isSubmitting = true;
    try {
      this.http.loginUser(this.user).subscribe(
        (response) => {
          this.apiResponse = response;
          localStorage.setItem('token', response.token);
          localStorage.setItem('userID', response.data.userID);
          setTimeout(() => {
            this.route.navigate(['/dashboard']); // Replace '/dashboard' with your desired route
            this.isSubmitting = false;
          }, 3000);
        },
        (error) => {
          this.isSubmitting = false;
        }
      );
    } catch (err) {
      console.log(err);
    }
  }
}
