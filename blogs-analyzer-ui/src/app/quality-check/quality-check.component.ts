import { Component } from '@angular/core';
import { Location } from "@angular/common";
import { BlogService } from "../services/blog.service";

@Component({
  selector: 'app-quality-check',
  templateUrl: './quality-check.component.html',
  styleUrls: ['./quality-check.component.scss']
})
export class QualityCheckComponent {
  postData: any;
  qualityResult!: string;

  constructor(private location: Location, private blogService: BlogService) {
  }

  ngOnInit(): void {
    this.postData = history.state.data;
  }

  goBack(): void {
    this.location.back();
  }

  checkQuality() {
    const prompt = 'Review blog with the following content' + this.postData;
    this.blogService.getBlogQuality(prompt).subscribe(
      response => {
        this.qualityResult = response;
      },
      error => {
        console.error('Error:', error);
        this.qualityResult = 'An error occurred';
      }
    );
  }
}
