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
  qualityResults: { label: string, value: number, comment: string }[] = [];


  constructor(private location: Location, private blogService: BlogService) {
  }

  ngOnInit(): void {
    this.postData = history?.state?.data;
  }

  goBack(): void {
    this.location.back();
  }

  checkQuality() {
    const prompt = 'Review blog with the following content: ' + this.postData +
      '\nParameters include fields like:\n' +
      '    - Duplicate Content\n' +
      '    - Spelling Mistakes\n' +
      '    - Grammatical Errors\n' +
      '    - Overall SEO Report\n' +
      '    - Content Quality: Accuracy, Depth and Completeness, Clarity and Conciseness, Logical Flow\n' +
      '    - Technical Accuracy\n' +
      '    - Targeted Audience\n' +
      '    - Structure and Formatting\n' +
      '    - Code Examples and Illustrations\n' +
      '    - Links and References\n' +
      '    - Overall Feedback\n' +
      '    - Improvement Areas\n' +
      'Display result in tabular view for respective percentages and feedback at that line no';
    this.blogService.getBlogQuality(prompt).subscribe(
      response => {
        this.qualityResults = this.parseResponse(response);
      },
      error => {
        console.error('Error:', error);
      }
    );
  }

  parseResponse(response: string): { label: string, value: number, comment: string }[] {
    const rows = response.split('\n').slice(2);
    return rows.map(row => {
      const cols = row.split('|').map(col => col.trim());
      const label = cols[1];
      const percentage = parseFloat(cols[2].replace('%', ''));
      const comment = cols[3];
      return {label, value: isNaN(percentage) ? 0 : percentage, comment};
    }).filter(result => result.label && !isNaN(result.value));
  }
}
