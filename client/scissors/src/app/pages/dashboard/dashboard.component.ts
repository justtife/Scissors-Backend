import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  @Input() pageTitle: string | any;
  @Input() pageSubTitle: string | any;
  isWidthToggled: boolean = true;
  toggleWidth() {
    this.isWidthToggled = !this.isWidthToggled;
  }
}
