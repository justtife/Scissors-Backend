import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubDashComponent } from '../sub-dash/sub-dash.component';
import { UserComponent } from '../user/user.component';
const routes: Routes = [
  { path: 'dashboard', component: SubDashComponent },
  { path: 'profile', component: UserComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
