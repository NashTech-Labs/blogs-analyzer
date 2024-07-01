import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientModule } from "@angular/common/http";
import { MatCardModule } from "@angular/material/card";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { BlogService } from "../../../services/blog.service";
import { Router } from "@angular/router";
import { of } from "rxjs";

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let blogService: jasmine.SpyObj<BlogService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const blogServiceSpy = jasmine.createSpyObj('BlogService', ['searchPostsByTitle', 'getPostById', 'getPostByAuthorId']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [RouterTestingModule, HttpClientModule, MatCardModule],
      providers: [
        { provide: BlogService, useValue: blogServiceSpy },
        { provide: Router, useValue: routerSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    blogService = TestBed.inject(BlogService) as jasmine.SpyObj<BlogService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call searchPostsByTitle and navigate on searchByTitle', () => {
    const mockData = [{ id: 1, title: 'Test Post' }];
    blogService.searchPostsByTitle.and.returnValue(of(mockData));

    component.searchTitle = 'Test';
    component.searchByTitle();

    expect(blogService.searchPostsByTitle).toHaveBeenCalledWith('Test');
    expect(router.navigate).toHaveBeenCalledWith(['/quality-check'], { state: { data: mockData } });
  });

  it('should not call searchPostsByTitle if searchTitle is empty', () => {
    component.searchTitle = '';
    component.searchByTitle();

    expect(blogService.searchPostsByTitle).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should call getPostById and navigate on getBlogById', () => {
    const mockData = { id: 1, title: 'Test Post' };
    blogService.getPostById.and.returnValue(of(mockData));

    component.blogId = 1;
    component.getBlogById();

    expect(blogService.getPostById).toHaveBeenCalledWith(1);
    expect(router.navigate).toHaveBeenCalledWith(['/quality-check'], { state: { data: mockData } });
  });

  it('should not call getPostById if blogId is not set', () => {
    component.blogId = 0;
    component.getBlogById();

    expect(blogService.getPostById).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
