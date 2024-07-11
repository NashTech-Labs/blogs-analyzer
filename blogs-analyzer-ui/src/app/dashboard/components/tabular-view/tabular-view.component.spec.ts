import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabularViewComponent } from './tabular-view.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatCardModule } from "@angular/material/card";
import { HttpClientModule } from "@angular/common/http";
import { RouterTestingModule } from "@angular/router/testing";
import { LoggerModule, NGXLogger, NgxLoggerLevel } from "ngx-logger";
import { of, throwError } from "rxjs";

describe('TabularViewComponent', () => {
  let component: TabularViewComponent;
  let fixture: ComponentFixture<TabularViewComponent>;
  let logger: jasmine.SpyObj<NGXLogger>;

  beforeEach(() => {
    const loggerSpy = jasmine.createSpyObj('NGXLogger', ['debug', 'error']);

    TestBed.configureTestingModule({
      declarations: [TabularViewComponent],
      imports: [RouterTestingModule, HttpClientModule, MatCardModule, LoggerModule.forRoot({
        level: NgxLoggerLevel.DEBUG,
        serverLogLevel: NgxLoggerLevel.ERROR
      })],
      providers: [
        { provide: NGXLogger, useValue: loggerSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(TabularViewComponent);
    component = fixture.componentInstance;
    logger = TestBed.inject(NGXLogger as any) as jasmine.SpyObj<NGXLogger>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change page and fetch posts on page change', () => {
    spyOn(component, 'fetchPosts');
    component.onPageChange(2);

    expect(component.currentPage).toBe(2);
    expect(component.fetchPosts).toHaveBeenCalledWith(2);
  });

  it('should not change page if page is invalid', () => {
    spyOn(component, 'fetchPosts');

    component.onPageChange(0);
    expect(component.currentPage).toBe(1);
    expect(component.fetchPosts).not.toHaveBeenCalled();

    component.isLastPage = true;
    component.currentPage = 1;
    component.onPageChange(2);
    expect(component.currentPage).toBe(1);
    expect(component.fetchPosts).not.toHaveBeenCalled();
  });

  it('should navigate to the first page', () => {
    spyOn(component, 'onPageChange');
    component.navigateToFirstPage();

    expect(component.onPageChange).toHaveBeenCalledWith(1);
  });

  it('should navigate to the last page', () => {
    component.totalPages = 5;
    spyOn(component, 'onPageChange');
    component.navigateToLastPage();

    expect(component.onPageChange).toHaveBeenCalledWith(5);
  });

  it('should fetch posts for specified page', () => {
    const mockData = {
      posts: [{id: 1, authorName: 'Author 1', authorId: 1, title: 'Post 1', url: '/post/1', status: 'Published'}],
      totalPages: 2,
      isLastPage: false
    };
    spyOn(component.blogService, 'getAllPosts').and.returnValue(of(mockData));

    component.fetchPosts(1);

    expect(component.loading).toBeFalse();
    expect(component.errorMessage).toBeNull();
    expect(component.rowData.length).toBe(1);
    expect(component.totalPages).toBe(2);
    expect(component.isLastPage).toBeFalse();
    expect(component.logger.debug).toHaveBeenCalledWith('Fetching posts for page 1 with page size 10');
  });

  it('should handle error when fetching posts fails', () => {
    const mockError = new Error('Failed to fetch posts');
    spyOn(component.blogService, 'getAllPosts').and.returnValue(throwError(mockError));

    component.fetchPosts(1);

    expect(component.loading).toBeFalse();
    expect(component.errorMessage).toContain('Failed to fetch Data');
    expect(logger.error).toHaveBeenCalledWith('Error fetching posts for page 1: Failed to fetch posts');
  });

  it('should initialize column definitions', () => {
    expect(component.columnDefs.length).toBeGreaterThan(0);
    expect(component.columnDefs[0].headerName).toBe('Blog ID');
  });

  it('should emit click event', () => {
    spyOn(component.clickEvent, 'emit');
    component.clickEvent.emit(1);

    expect(component.clickEvent.emit).toHaveBeenCalledWith(1);
  });

  it('should handle quality check button click', () => {
    const mockResponse = { id: 1, title: 'Test Post' };
    spyOn(component.blogService, 'getPostById').and.returnValue(of(mockResponse));
    spyOn(component.router, 'navigate');

    const params = { data: { id: 1 } };
    component.columnDefs.find(col => col.field === 'id' && col.headerName === 'Quality Check').onCellClicked(params);

    expect(logger.debug).toHaveBeenCalledWith('Initiating quality check for blog ID: 1');
    expect(component.router.navigate).toHaveBeenCalledWith(['/quality-check'], { state: { data: mockResponse } });
  });

  it('should handle error during quality check button click', () => {
    const mockError = new Error('Failed to fetch post by ID');
    spyOn(component.blogService, 'getPostById').and.returnValue(throwError(mockError));

    const params = { data: { id: 1 } };
    component.columnDefs.find(col => col.field === 'id' && col.headerName === 'Quality Check').onCellClicked(params);

    expect(logger.error).toHaveBeenCalledWith('Error fetching post by ID 1: Failed to fetch post by ID');
    expect(component.errorMessage).toContain('Failed to fetch Data');
  });

  it('should have loading state initially', () => {
    expect(component.loading).toBeTrue();
  });

  it('should update loading state after fetchPosts call', () => {
    const mockData = { posts: [], totalPages: 1, isLastPage: true };
    spyOn(component.blogService, 'getAllPosts').and.returnValue(of(mockData));

    component.fetchPosts(1);

    expect(component.loading).toBeFalse();
  });

  it('should set isLastPage correctly', () => {
    const mockData = { posts: [], totalPages: 1, isLastPage: true };
    spyOn(component.blogService, 'getAllPosts').and.returnValue(of(mockData));

    component.fetchPosts(1);

    expect(component.isLastPage).toBeTrue();
  });

  it('should set totalPages correctly', () => {
    const mockData = { posts: [], totalPages: 3, isLastPage: false };
    spyOn(component.blogService, 'getAllPosts').and.returnValue(of(mockData));

    component.fetchPosts(1);

    expect(component.totalPages).toBe(3);
  });

  it('should handle click event for view button', () => {
    spyOn(window, 'open');

    const params = { data: { url: 'http://example.com' } };
    component.columnDefs.find(col => col.field === 'url' && col.headerName === 'View').onCellClicked(params);

    expect(window.open).toHaveBeenCalledWith('http://example.com', '_blank');
  });
});
