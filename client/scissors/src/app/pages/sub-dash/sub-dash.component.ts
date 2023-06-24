import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user-service.service';
@Component({
  selector: 'app-sub-dash',
  templateUrl: './sub-dash.component.html',
  styleUrls: ['./sub-dash.component.scss'],
})
export class SubDashComponent {
  numbers = [1, 2, 3, 4];
  inputText: string = '';
  newTag: string = '';
  tags: string[] = [];
  userData: any;
 
  constructor(private http: UserService) {}
  ngOnInit() {
    this.getAUser();
  }
  convertToLower(value: string) {
    this.inputText = value.toLowerCase();
  }
  addTag() {
    if (this.newTag.trim() !== '') {
      this.tags.push(this.newTag);
      this.newTag = '';
    }
  }
  removeTag(index: number) {
    this.tags.splice(index, 1);
  }
  getAUser() {
    let userID = localStorage.getItem('userID');
    this.http.getUser(userID as string).subscribe(
      (response: any) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
