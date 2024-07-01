import { Component, Input, OnChanges } from '@angular/core';
import * as Highcharts from 'highcharts';
import { Options } from 'highcharts';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnChanges {
  @Input() actualLabel: string[] = [];
  @Input() oppositeLabel: string[] = [];
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
    const pairedData = this.chartData.map(value => {
      const emptyValue = 100 - value;
      return [value, emptyValue];
    });

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
        data: this.actualLabel.map((label, index) => ({
          name: `${label}`,
          y: pairedData[index][0],
        })).concat(this.oppositeLabel.map((label, index) => ({
          name: `${label}`,
          y: pairedData[index][1],
        })))
      }],
      tooltip: {
        pointFormat: '<b>{point.percentage:.1f}%</b>'
      },
    }
  }
}