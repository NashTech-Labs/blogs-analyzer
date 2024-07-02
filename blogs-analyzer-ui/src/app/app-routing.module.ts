import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from "./dashboard/dashboard.component";
import { QualityCheckComponent } from "./quality-check/quality-check.component";

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {path: 'home', component: DashboardComponent},
  {path: 'quality-check', component: QualityCheckComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: '**', redirectTo: '/home'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
