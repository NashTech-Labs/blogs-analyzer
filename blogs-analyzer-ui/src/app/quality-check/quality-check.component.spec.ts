import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QualityCheckComponent } from './quality-check.component';
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientModule } from "@angular/common/http";
import { HeaderComponent } from "../dashboard/components/header/header.component";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { BlogService } from "../services/blog.service";
import { of, throwError } from 'rxjs';
import { LoggerModule, NgxLoggerLevel } from "ngx-logger";

describe('QualityCheckComponent', () => {
  let component: QualityCheckComponent;
  let fixture: ComponentFixture<QualityCheckComponent>;
  let blogService: BlogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QualityCheckComponent, HeaderComponent],
      imports: [RouterTestingModule, HttpClientModule, MatIconModule, MatCardModule, LoggerModule.forRoot({
        level: NgxLoggerLevel.DEBUG,
        serverLogLevel: NgxLoggerLevel.ERROR
      })],
      providers: [BlogService]
    });
    fixture = TestBed.createComponent(QualityCheckComponent);
    component = fixture.componentInstance;
    blogService = TestBed.inject(BlogService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call location.back on goBack', () => {
    const locationSpy = spyOn(component['location'], 'back');
    component.goBack();
    expect(locationSpy).toHaveBeenCalled();
  });

  it('should call blogService.getBlogQuality with correct prompt on checkQuality', () => {
    component.postData = 'Sample blog content';
    const expectedPrompt = `Review blog with the following content: Sample blog content
    Parameters include fields like:
    - Original Content
- Correct Spelling
- No Grammatical Error
- Overall SEO Report
- Accuracy
- Depth and Completeness
- Clarity and Conciseness
- Logical Flow
- Technical Accuracy
- Targeted Audience
- Structure and Formatting
- Code Examples and Illustrations
- Links and References
- Overall Feedback %
    Display result in tabular view for respective percentages with accurate feedback;`;

    spyOn(blogService, 'getBlogQuality').and.returnValue(of(''));
    component.checkQuality();
    expect(blogService.getBlogQuality).toHaveBeenCalledWith(expectedPrompt);
  });

  it('should parse a valid response correctly', () => {
    const response = `
    | Label | Percentage | Comment |
    | Original Content | 90% | Some duplicate content |
    | Correct Spelling | 95% | Some spelling mistakes |`;
    const expectedResults = [
      {
        oppositeLabel: 'Duplicate Content',
        originalLabel: 'Original Content',
        value: 90,
        comment: 'Some duplicate content'
      },
      {
        oppositeLabel: 'Spelling Mistakes',
        originalLabel: 'Correct Spelling',
        value: 95,
        comment: 'Some spelling mistakes'
      }
    ];
    const results = component.parseResponse(response);
    expect(results).toEqual(expectedResults);
  });

  it('should handle an empty response', () => {
    const response = '';
    const results = component.parseResponse(response);
    expect(results).toEqual([]);
  });

  it('should handle a response with partially valid rows', () => {
    const response = `
    | Label | Percentage | Comment |
    | Original Content |95% | Some duplicate content |
    | Invalid Row`;
    const expectedResults = [
      {
        oppositeLabel: 'Duplicate Content',
        originalLabel: 'Original Content',
        value: 95,
        comment: 'Some duplicate content'
      }
    ];
    const results = component.parseResponse(response);
    expect(results).toEqual(expectedResults);
  });

  it('should handle error in checkQuality()', () => {
    component.postData = 'Sample blog content';
    spyOn(blogService, 'getBlogQuality').and.returnValue(throwError({message: 'Test error message'}));
    component.checkQuality();
    expect(component.errorMessage).toContain('Failed to check blog quality');
  });

  it('should calculate overall rating and feedback correctly', () => {
    const response = `
    | Label | Percentage | Comment |
    | OVERALL FEEDBACK % | 80% | Very good content |`;
    component.parseResponse(response);
    expect(component.overallRating).toEqual(4);
    expect(component.overallFeedback).toEqual('Very good content');
  });

  it('should handle blogService.getBlogQuality response correctly in checkQuality()', () => {
    component.draftPost = 'Sample draft content';
    spyOn(blogService, 'getBlogQuality').and.returnValue(of('yes'));
    component.checkQuality();
    expect(component.isLoading).toBe(false);
  });

  it('should handle blogService.getBlogQuality error in checkQuality()', () => {
    component.draftPost = 'Sample draft content';
    spyOn(blogService, 'getBlogQuality').and.returnValue(throwError({ message: 'Test error' }));
    component.checkQuality();
    expect(component.errorMessage).toBe('Failed to check blog quality. Please try again later.<br><br>Test error');
  });

  it('should unsubscribe from all subscriptions on ngOnDestroy', () => {
    const subscription1 = jasmine.createSpyObj('Subscription', ['unsubscribe']);
    const subscription2 = jasmine.createSpyObj('Subscription', ['unsubscribe']);
    component.subscriptions.push(subscription1, subscription2);
    component.ngOnDestroy();
    expect(subscription1.unsubscribe).toHaveBeenCalled();
    expect(subscription2.unsubscribe).toHaveBeenCalled();
  });
});
