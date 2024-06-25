import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './dashboard/components/header/header.component';
import { MaterialModule } from "./shared/module/material.module";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { TabularViewComponent } from './dashboard/components/tabular-view/tabular-view.component';
import { AgGridModule } from "ag-grid-angular";
import { MatCardModule } from "@angular/material/card";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatIconModule } from "@angular/material/icon";
import { HomeComponent } from './dashboard/components/home/home.component';
import { QualityCheckComponent } from './quality-check/quality-check.component';
import { MatButtonModule } from "@angular/material/button";
import { ReportComponent } from './report/report.component';
import { HighchartsChartModule } from "highcharts-angular";

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HeaderComponent,
    TabularViewComponent,
    HomeComponent,
    QualityCheckComponent,
    ReportComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    HttpClientModule,
    AgGridModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    HighchartsChartModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
