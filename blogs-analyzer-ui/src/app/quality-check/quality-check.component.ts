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
  qualityResults: { originalLabel: string; oppositeLabel: string; value: number; comment: string }[] = [];
  labels = [
    {actual: 'Duplicate Content', opposite: 'Original Content'},
    {actual: 'Spelling Mistakes', opposite: 'Correct Spelling'},
    {actual: 'Grammatical Errors', opposite: 'Proper Grammar'},
    {actual: 'Overall SEO Report', opposite: 'SEO Optimization'},
    {actual: 'Accuracy', opposite: 'Inaccuracy'},
    {actual: 'Depth and Completeness', opposite: 'Superficiality'},
    {actual: 'Clarity and Conciseness', opposite: 'Ambiguity and verbosity'},
    {actual: 'Logical Flow', opposite: 'Disorganization'},
    {actual: 'Technical Accuracy', opposite: 'Inaccuracy'},
    {actual: 'Targeted Audience', opposite: 'General Audience'},
    {actual: 'Structure and Formatting', opposite: 'Poor Structure and Formatting'},
    {actual: 'Code Examples and Illustrations', opposite: 'Lack of Code Examples and Illustrations'},
    {actual: 'Links and References', opposite: 'Missing Links and References'},
    {actual: 'Overall Feedback', opposite: 'No Feedback'}
  ];

  constructor(private location: Location, private blogService: BlogService) {
  }

  ngOnInit(): void {
    this.postData = history?.state?.data;
  }

  goBack(): void {
    this.location.back();
  }

  checkQuality() {
    const prompt = `Review blog with the following content: ${this.postData}
    Parameters include fields like:
    ${this.labels.map(label => `- ${label.actual}`).join('\n')}
    Display result in tabular view for respective percentages and accurate feedback;`;

    this.blogService.getBlogQuality(prompt).subscribe({
      next: response => {
        this.qualityResults = this.parseResponse(response);
      },
      error: error => {
        console.error('Error:', error);
      }
    });
  }

  parseResponse(response: string): { originalLabel: string; oppositeLabel: string; value: number; comment: string }[] {
    const rows = response.split('\n').slice(2);
    const pairedResults: { originalLabel: string; oppositeLabel: string; value: number; comment: string }[] = [];

    rows.forEach(row => {
      const cols = row.split('|').map(col => col.trim());
      if (cols.length < 3) return;

      let label = cols[1]?.replace(/\*\*/g, '');
      let percentage = parseFloat(cols[2]?.replace('%', ''));
      let comment = cols?.slice(3).join(' ').trim();

      const oppositeIndex = this.labels.findIndex(l => l.actual === label);
      if (oppositeIndex !== -1) {
        const oppositeLabel = this.labels[oppositeIndex].opposite;
        pairedResults.push({originalLabel: label, oppositeLabel, value: percentage, comment});
      }
    });
    return pairedResults;
  }
}
