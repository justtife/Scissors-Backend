import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user-service.service';
import { AlertComponent } from 'src/app/component/alert/alert.component';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  isSubmitting: boolean = false;
  user: any = {};
  apiResponse: any;
  responseMessage: string = '';
  responseType: object | any = {
    type: '',
    icon: '',
  };
  selectedFile: any;
  @ViewChild(AlertComponent) alertComponent!: AlertComponent;
  constructor(private http: UserService, private route: Router) {}
  resetAlert(): void {
    if (this.alertComponent) {
      this.alertComponent.resetAlert();
    }
  }
  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (!inputElement.files || inputElement.files.length === 0) {
      return;
    }
    const file = inputElement.files;
    this.selectedFile = file;
    this.user.profilePic = file;
    console.log(inputElement.files);
  }
  async onSubmit() {
    console.log(this.user);
    this.isSubmitting = true;
    try {
      this.http.signUser(this.user).subscribe(
        (response: any) => {
          this.apiResponse = response;
          this.responseType.type = 'alert-success';
          this.responseType.icon = 'bi-hand-thumbs-up';
          localStorage.setItem('token', response.token);
          localStorage.setItem('userID', response.data.userID);
          setTimeout(() => {
            this.route.navigate(['/dashboard']);
            this.isSubmitting = false;
          }, 3000);
        },
        (error: any) => {
          this.apiResponse = error.error;
          this.responseType.type = 'alert-warning';
          this.responseType.icon = 'bi-exclamation-triangle';
          this.isSubmitting = false;
          this.resetAlert();
        }
      );
    } catch (err) {
      console.log(err);
    }
  }

  countries = [
    { name: 'Country 1', code: 'C1' },
    { name: 'Country 2', code: 'C2' },
    { name: 'Country 3', code: 'C3' },
    // Add more countries as needed
  ];
}
