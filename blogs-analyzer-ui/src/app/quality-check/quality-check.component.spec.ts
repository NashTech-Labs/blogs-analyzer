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
    - Duplicate Content
- Spelling Mistakes
- Grammatical Errors
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
    Display result in tabular view for respective percentages and accurate feedback;`;

    spyOn(blogService, 'getBlogQuality').and.returnValue(of(''));
    component.checkQuality();
    expect(blogService.getBlogQuality).toHaveBeenCalledWith(expectedPrompt);
  });

  it('should parse a valid response correctly', () => {
    const response = `
    | Label | Percentage | Comment |
    | Duplicate Content | 10% | Some duplicate content |
    | Spelling Mistakes | 5% | Some spelling mistakes |`;
    const expectedResults = [
      {
        originalLabel: 'Duplicate Content',
        oppositeLabel: 'Original Content',
        value: 10,
        comment: 'Some duplicate content'
      },
      {
        originalLabel: 'Spelling Mistakes',
        oppositeLabel: 'Correct Spelling',
        value: 5,
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
    | Duplicate Content | 10% | Some duplicate content |
    | Invalid Row`;
    const expectedResults = [
      {
        originalLabel: 'Duplicate Content',
        oppositeLabel: 'Original Content',
        value: 10,
        comment: 'Some duplicate content'
      }
    ];
    const results = component.parseResponse(response);
    expect(results).toEqual(expectedResults);
  });

  it('should handle error in checkQuality()', () => {
    component.postData = 'Sample blog content';
    const expectedPrompt = `Review blog with the following content: Sample blog content
  Parameters include fields like:
  - Duplicate Content
  - Spelling Mistakes
  - Overall Feedback %
  Display result in tabular view for respective percentages and accurate feedback;`;

    spyOn(blogService, 'getBlogQuality').and.returnValue(throwError({message: 'Test error message'}));
    component.checkQuality();

    expect(component.errorMessage).toContain('Failed to check blog quality');
  });

  it('should navigate back on goBack()', () => {
    const locationSpy = spyOn(component['location'], 'back');
    component.goBack();

    expect(locationSpy).toHaveBeenCalled();
  });

  it('should parse a valid response correctly', () => {
    const response = `
  | Label | Percentage | Comment |
  | Duplicate Content | 10% | Some duplicate content |
  | Spelling Mistakes | 5% | Some spelling mistakes |`;
    const expectedResults = [
      {
        originalLabel: 'Duplicate Content',
        oppositeLabel: 'Original Content',
        value: 10,
        comment: 'Some duplicate content'
      },
      {
        originalLabel: 'Spelling Mistakes',
        oppositeLabel: 'Correct Spelling',
        value: 5,
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
  | Duplicate Content | 10% | Some duplicate content |
  | Invalid Row`;
    const expectedResults = [
      {
        originalLabel: 'Duplicate Content',
        oppositeLabel: 'Original Content',
        value: 10,
        comment: 'Some duplicate content'
      }
    ];
    const results = component.parseResponse(response);
    expect(results).toEqual(expectedResults);
  });

  it('should calculate overall rating and feedback correctly', () => {
    const response = `
  | Label | Percentage | Comment |
  | OVERALL FEEDBACK % | 80% | Very good content |`;
    const expectedOverallRating = 4;
    component.parseResponse(response);
    expect(component.overallRating).toEqual(expectedOverallRating);
    expect(component.overallFeedback).toEqual('Very good content');
  });
});
