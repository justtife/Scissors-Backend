import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupComponent } from './pages/signup/signup.component';
import { LoginComponent } from './pages/login/login.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { TopnavComponent } from './component/topnav/topnav.component';
import { StattabComponent } from './component/stattab/stattab.component';
import { MainComponent } from './component/main/main.component';
import { HomeComponent } from './pages/home/home.component';
import { AlertComponent } from './component/alert/alert.component';
import { SubDashComponent } from './pages/sub-dash/sub-dash.component';
import { DashboardModule } from './pages/dashboard/dashboard.module';
import { HeaderModule } from './component/header/header.module';
import { UserComponent } from './pages/user/user.component';
import { HttpClientModule } from '@angular/common/http';
@NgModule({
  declarations: [
    AppComponent,
    // DashboardComponent,
    SignupComponent,
    LoginComponent,
    NavbarComponent,
    TopnavComponent,
    StattabComponent,
    MainComponent,
    HomeComponent,
    AlertComponent,
    // HeaderComponent,
    SubDashComponent,
    UserComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    DashboardModule,
    HeaderModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
