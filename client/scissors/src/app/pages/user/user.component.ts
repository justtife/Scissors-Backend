import { Component, Input } from '@angular/core';
import { UserService } from 'src/app/services/user-service.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent {
  // @ViewChild('fileInput') fileInput!: ElementRef;
  selectedFile: File | null = null;
  userData: any;

  ngOnInit() {
    this.getAUser();
  }
  constructor(private http: UserService) {}
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
  openFilePicker() {
    const input = document.createElement('input');
    input.type = 'file';

    // Add an event listener to handle the file selection
    input.addEventListener('change', (event) => {
      const selectedFile = (event.target as HTMLInputElement)?.files?.[0];
      if (selectedFile) {
        this.selectedFile = selectedFile;
        // Do something with the selected file
      }
    });

    // Trigger the file selection dialog
    input.click();
  }
  cancelSelection() {
    this.selectedFile = null;
  }
}
