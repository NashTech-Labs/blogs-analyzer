import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientModule } from "@angular/common/http";
import { MatCardModule } from "@angular/material/card";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { BlogService } from "../../../services/blog.service";
import { Router } from "@angular/router";
import { of, throwError } from "rxjs";
import { LoggerModule, NGXLogger, NgxLoggerLevel } from "ngx-logger";

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let blogService: jasmine.SpyObj<BlogService>;
  let router: jasmine.SpyObj<Router>;
  let logger: jasmine.SpyObj<NGXLogger>;

  beforeEach(() => {
    const blogServiceSpy = jasmine.createSpyObj('BlogService', ['searchPostsByTitle', 'getPostById', 'getPostByAuthorId']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const loggerSpy = jasmine.createSpyObj('NGXLogger', ['debug', 'error']);

    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [RouterTestingModule, HttpClientModule, MatCardModule, LoggerModule.forRoot({
        level: NgxLoggerLevel.DEBUG,
        serverLogLevel: NgxLoggerLevel.ERROR
      })],
      providers: [
        {provide: BlogService, useValue: blogServiceSpy},
        {provide: Router, useValue: routerSpy},
        {provide: NGXLogger, useValue: loggerSpy}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    blogService = TestBed.inject(BlogService) as jasmine.SpyObj<BlogService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    logger = TestBed.inject(NGXLogger as any) as jasmine.SpyObj<NGXLogger>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call searchPostsByTitle and navigate on searchByTitle', () => {
    const mockData = [{id: 1, title: 'Test Post'}];
    blogService.searchPostsByTitle.and.returnValue(of(mockData));

    component.searchTitle = 'Test';
    component.searchByTitle();

    expect(blogService.searchPostsByTitle).toHaveBeenCalledWith('Test');
    expect(router.navigate).toHaveBeenCalledWith(['/quality-check'], {state: {data: mockData}});
  });

  it('should not call searchPostsByTitle if searchTitle is empty', () => {
    component.searchTitle = '';
    component.searchByTitle();

    expect(blogService.searchPostsByTitle).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should call getPostById and navigate on getBlogById', () => {
    const mockData = {id: 1, title: 'Test Post'};
    blogService.getPostById.and.returnValue(of(mockData));

    component.blogId = 1;
    component.getBlogById();

    expect(blogService.getPostById).toHaveBeenCalledWith(1);
    expect(router.navigate).toHaveBeenCalledWith(['/quality-check'], {state: {data: mockData}});
  });

  it('should not call getPostById if blogId is not set', () => {
    component.blogId = 0;
    component.getBlogById();

    expect(blogService.getPostById).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should handle empty searchTitle in searchByTitle', () => {
    component.searchTitle = '';
    component.searchByTitle();

    expect(component.errorMessage).toBeNull();
    expect(component.errorContext).toBeNull();
    expect(blogService.searchPostsByTitle).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should handle error in searchByTitle', () => {
    const mockError = new Error('Search failed');
    blogService.searchPostsByTitle.and.returnValue(throwError(mockError));

    component.searchTitle = 'Test';
    component.searchByTitle();

    expect(component.errorMessage).toEqual('Search failed');
    expect(component.errorContext).toEqual('title');
    expect(router.navigate).not.toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledWith(`Error searching posts by title: ${mockError.message}`);
  });

  it('should log error when search fails', () => {
    const mockError = new Error('Search failed');
    blogService.searchPostsByTitle.and.returnValue(throwError(mockError));

    component.searchTitle = 'Test';
    component.searchByTitle();

    expect(logger.error).toHaveBeenCalledWith(`Error searching posts by title: ${mockError.message}`);
  });

  it('should handle unset authorId in getBlogByAuthorId', () => {
    component.authorId = 0;
    component.getBlogByAuthorId();

    expect(component.errorMessage).toBeNull();
    expect(component.errorContext).toBeNull();
    expect(blogService.getPostByAuthorId).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should handle error in getBlogByAuthorId', () => {
    const mockError = new Error('Fetch by author failed');
    blogService.getPostByAuthorId.and.returnValue(throwError(mockError));

    component.authorId = 1;
    component.getBlogByAuthorId();

    expect(component.errorMessage).toEqual('Fetch by author failed');
    expect(component.errorContext).toEqual('author');
    expect(router.navigate).not.toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledWith(`Error fetching posts by author ID: ${mockError.message}`);
  });

  it('should handle unset blogId in getBlogById', () => {
    component.blogId = 0;
    component.getBlogById();

    expect(component.errorMessage).toBeNull();
    expect(component.errorContext).toBeNull();
    expect(blogService.getPostById).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should handle error in getBlogById', () => {
    const mockError = new Error('Fetch failed');
    blogService.getPostById.and.returnValue(throwError(mockError));

    component.blogId = 1;
    component.getBlogById();

    expect(component.errorMessage).toEqual('Fetch failed');
    expect(component.errorContext).toEqual('id');
    expect(router.navigate).not.toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledWith(`Error fetching post by ID: ${mockError.message}`);
  });

});
