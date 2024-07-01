import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportComponent } from './report.component';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';

describe('ReportComponent', () => {
  let component: ReportComponent;
  let fixture: ComponentFixture<ReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportComponent],
      imports: [HighchartsChartModule]
    });
    fixture = TestBed.createComponent(ReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.actualLabel).toEqual([]);
    expect(component.oppositeLabel).toEqual([]);
    expect(component.chartData).toEqual([]);
    expect(component.chartTitle).toBe('');
  });

  it('should update chart options on ngOnInit', () => {
    spyOn(component, 'updateChartOptions');
    component.ngOnInit();
    expect(component.updateChartOptions).toHaveBeenCalled();
  });

  it('should update chart options on ngOnChanges', () => {
    spyOn(component, 'updateChartOptions');
    component.ngOnChanges();
    expect(component.updateChartOptions).toHaveBeenCalled();
  });

  it('should set chart options correctly in updateChartOptions', () => {
    component.chartData = [30, 70];
    component.actualLabel = ['Actual1', 'Opposite1'];
    component.oppositeLabel = ['Actual2', 'Opposite2'];
    component.chartTitle = 'Test Chart';

    component.updateChartOptions();

    const expectedChartOptions: Highcharts.Options = {
      chart: { type: 'pie' },
      title: { text: 'Test Chart' },
      plotOptions: {
        pie: {
          innerSize: '50%',
          dataLabels: { enabled: true }
        }
      },
      series: [{
        type: 'pie',
        data: [
          { name: 'Actual1', y: 30 },
          { name: 'Opposite1', y: 70 },
          { name: 'Actual2', y: 70 },
          { name: 'Opposite2', y: 30 }
        ]
      }],
      tooltip: { pointFormat: '<b>{point.percentage:.1f}%</b>' }
    };

    expect(component.chartOptions).toEqual(expectedChartOptions);
  });
});
