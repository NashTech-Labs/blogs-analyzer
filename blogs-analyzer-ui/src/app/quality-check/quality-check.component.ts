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
    this.postData = history?.state?.data;
  }

  goBack(): void {
    this.location.back();
  }

  checkQuality() {
    const prompt = 'Review blog with the following content: ' + this.postData +
      '\nParameters include fields like:\n' +
      '- Plagiarism\n' +
      '- Duplicate\n' +
      '- Spelling Mistakes\n' +
      '- Grammar\n' +
      '- Overall SEO Report\n' +
      '- Content Quality: Accuracy, Depth and Completeness, Clarity and Conciseness, Logical Flow\n' +
      '- Technical Accuracy\n' +
      '- Target Audience\n' +
      '- Structure and Formatting\n' +
      '- Code Examples and Illustrations\n' +
      '- Links and References\n' +
      '- Overall Feedback\n' +
      '- Improvement Areas\n' +
      'Display result for respective percentages and feedback';
    this.blogService.getBlogQuality(prompt).subscribe(
      response => {
        this.qualityResult = this.removeMarkdownFormatting(response);
      },
      error => {
        console.error('Error:', error);
        this.qualityResult = 'An error occurred';
      }
    );
  }

  removeMarkdownFormatting(text: string) {
    // Replace Markdown bold formatting with empty string
    return text.replace(/\*\*(.*?)\*\*/g, '$1');
  }
}
