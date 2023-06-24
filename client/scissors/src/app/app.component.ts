import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'scissors';
  isAnimated = false;
  isArrowRight: boolean = false;
  toggleAnimate() {
    this.isAnimated = !this.isAnimated;
    this.isArrowRight = !this.isArrowRight;
  }
}
