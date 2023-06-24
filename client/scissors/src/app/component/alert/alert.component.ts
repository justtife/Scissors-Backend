import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent {
  @Input() responseMessage: any;
  @Input() responseType: any;
  @Input() responseIcon: any;
  showAlert: boolean = true;
  showTimerAlert = false;
  timerDuration = 5000; // 5 seconds
  onCancelClick(): void {
    this.showAlert = false;
  }
  public resetAlert(): void {
    this.showAlert = true;
    setTimeout(() => {
      this.showAlert = false;
    }, 5000);
  }
}
