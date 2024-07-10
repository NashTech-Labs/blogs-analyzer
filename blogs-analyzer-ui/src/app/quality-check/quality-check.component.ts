import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Location } from "@angular/common";
import { BlogService } from "../services/blog.service";
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-quality-check',
  templateUrl: './quality-check.component.html',
  styleUrls: ['./quality-check.component.scss']
})
export class QualityCheckComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('docViewer') docViewer!: ElementRef;
  fileUrl: string = '';
  postData: string | undefined;
  qualityResults: { originalLabel: string; oppositeLabel: string; value: number; comment: string }[] = [];
  errorMessage: string | null = null;
  overallFeedback: string | null = null;
  overallRating: number = 0;
  isLoading: boolean = false;
  initialLoading: boolean = false;
  draftPost!: string;
  subscriptions: Subscription[] = [];

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
    {actual: 'Overall Feedback %', opposite: 'No Feedback'}
  ];

  constructor(private location: Location, private blogService: BlogService, private logger: NGXLogger) {
  }

  ngOnInit(): void {
    this.postData = history?.state?.data;
    this.fileUrl = history?.state?.url;
    this.logger.debug('Initialized QualityCheckComponent');
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.docViewer && this.docViewer.nativeElement) {
        this.draftPost = this.docViewer.nativeElement.firstElementChild?.firstElementChild?.innerHTML || '';
        console.log(this.draftPost)
      }
    }, 500);
  }

  goBack(): void {
    this.location.back();
    this.logger.debug('Navigated back');
  }

  checkQuality() {
    if (!this.draftPost && !this.postData) {
      this.errorMessage = 'No blog content available to check quality.';
      return;
    }

    this.isLoading = true;
    let prompt = '';
    if (!this.draftPost) {
      prompt = `Review blog with the following content: ${this.postData}
    Parameters include fields like:
    ${this.labels.map(label => `- ${label.actual}`).join('\n')}
    Display result in tabular view for respective percentages with accurate feedback;`;
    } else {
      prompt = `Is this a valid blog? ${this.draftPost}. Answer Yes/No Only`;
    }

    this.errorMessage = null;
    const subscription = this.blogService.getBlogQuality(prompt).subscribe({
      next: response => {
        if (this.draftPost && response.trim().toLowerCase() === 'yes') {
          this.reviewBlogContent(this.draftPost);
        } else if (this.draftPost && response.trim().toLowerCase() === 'no') {
          this.errorMessage = `This is not a Valid Blog.<br><br>`;
          this.isLoading = false;
        } else {
          this.qualityResults = this.parseResponse(response);
          this.logger.debug('Blog quality checked successfully :: ' + this.qualityResults);
          this.isLoading = false;
        }
      },
      error: error => {
        this.errorMessage = `Failed to check blog quality. Please try again later.<br><br>${error.message}`;
        this.logger.error(`Error checking blog quality: ${error.message}`);
        this.isLoading = false;
      }
    });
    this.subscriptions.push(subscription);
  }

  reviewBlogContent(content: string) {
    const prompt = `Review blog with the following content: ${content}
    Parameters include fields like:
    ${this.labels.map(label => `- ${label.actual}`).join('\n')}
    Display result in tabular view for respective percentages with accurate feedback;`;

    const subscription = this.blogService.getBlogQuality(prompt).subscribe({
      next: response => {
        this.qualityResults = this.parseResponse(response);
        this.logger.debug('Blog quality checked successfully :: ' + this.qualityResults);
        this.isLoading = false;
      },
      error: error => {
        this.errorMessage = `Failed to check blog quality. Please try again later.<br><br>${error.message}`;
        this.logger.error(`Error checking blog quality: ${error.message}`);
        this.isLoading = false;
      }
    });
    this.subscriptions.push(subscription);
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

      if (label?.toUpperCase().startsWith('OVERALL FEEDBACK')) {
        this.overallRating = isNaN(percentage) ? 4 : percentage / 20.0;
        this.overallFeedback = comment;
        this.logger.debug(`Overall Rating calculated: ${this.overallRating}`);
        return;
      }
      const oppositeIndex = this.labels.findIndex(l => l.actual === label);
      if (oppositeIndex !== -1) {
        const oppositeLabel = this.labels[oppositeIndex].opposite;
        pairedResults.push({originalLabel: label, oppositeLabel, value: percentage, comment});
        this.logger.debug(`Parsed response for ${label}: ${percentage}%`);
      }
    });
    return pairedResults;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
