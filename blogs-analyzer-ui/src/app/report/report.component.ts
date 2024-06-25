import { Component, Input } from '@angular/core';
import * as Highcharts from 'highcharts';
import { Options } from "highcharts";

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent {
  @Input() chartLabels: string[] = [];
  @Input() chartData: number[] = [];
  @Input() chartTitle: string = '';

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Options = {};

  ngOnInit() {
    this.updateChartOptions();
  }

  ngOnChanges() {
    this.updateChartOptions();
  }

  updateChartOptions() {
    this.chartOptions = {
      chart: {
        type: 'pie'
      },
      title: {
        text: this.chartTitle
      },
      plotOptions: {
        pie: {
          innerSize: '50%',
          dataLabels: {
            enabled: true
          }
        }
      },
      series: [{
        type: 'pie',
        data: this.chartLabels.map((label, index) => ({
          name: label,
          y: this.chartData[index]
        }))
      }]
    };
  }
}