import { Component } from '@angular/core';
import { Location } from "@angular/common";

@Component({
  selector: 'app-quality-check',
  templateUrl: './quality-check.component.html',
  styleUrls: ['./quality-check.component.scss']
})
export class QualityCheckComponent {
  postData: any;

  constructor(private location: Location) {
  }

  ngOnInit(): void {
    this.postData = history.state.data;
  }

  goBack(): void {
    this.location.back();
  }
}
