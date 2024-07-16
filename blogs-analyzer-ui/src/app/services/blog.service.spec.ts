import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BlogService } from './blog.service';
import { environment } from '../../environments/environment';
import { NGXLogger } from 'ngx-logger';
import { HttpErrorResponse } from "@angular/common/http";

describe('BlogService', () => {
  let service: BlogService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.apiUrl;
  let loggerSpy: jasmine.SpyObj<NGXLogger>;

  beforeEach(() => {
    const loggerSpyObj = jasmine.createSpyObj('NGXLogger', ['debug', 'error']);

    TestBed.configureTestingModule({
      providers: [
        BlogService,
        {provide: NGXLogger, useValue: loggerSpyObj}
      ],
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(BlogService);
    httpMock = TestBed.inject(HttpTestingController);
    loggerSpy = TestBed.inject(NGXLogger) as jasmine.SpyObj<NGXLogger>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should search posts by title', () => {
    const mockResponse = 'mock response';
    const title = 'test';
    service.searchPostsByTitle(title).subscribe(response => {
      expect(response).toBe(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/wordpress/posts-by-title?title=${encodeURIComponent(title)}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get all posts', () => {
    const mockResponse = {
      posts: [{id: 1, title: 'Test Post'}],
      totalPages: 1
    };
    const page = 1;
    const pageSize = 10;
    service.getAllPosts(page, pageSize).subscribe(response => {
      expect(response.posts).toEqual(mockResponse.posts);
      expect(response.totalPages).toBe(mockResponse.totalPages);
    });

    const req = httpMock.expectOne(`${baseUrl}/wordpress?page=${page}&size=${pageSize}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get post by id', () => {
    const mockResponse = 'mock post';
    const id = 1;
    service.getPostById(id).subscribe(response => {
      expect(response).toBe(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/wordpress/posts/${id}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get post by author id', () => {
    const mockResponse = 'mock response';
    const id = 1;
    service.getPostByAuthorId(id).subscribe(response => {
      expect(response).toBe(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/wordpress/posts-by-author?authorId=${id}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get blog quality', () => {
    const mockResponse = 'mock response';
    const prompt = 'test prompt';
    service.getBlogQuality(prompt).subscribe(response => {
      expect(response).toBe(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/gemini/v1/review`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBe(prompt);
    req.flush(mockResponse);
  });

  it('should handle client-side error', () => {
    const clientSideError = new ErrorEvent('Client-side error', {message: 'Test client-side error message'});

    const result = service.handleError(new HttpErrorResponse({
      error: clientSideError,
      status: 404,
      statusText: 'Not Found'
    }));

    expect(loggerSpy.error).toHaveBeenCalledWith('BlogService :: Encountered an error: An error occurred: Test client-side error message');
    result.subscribe({
      error: (error: Error) => {
        expect(error.message).toBe('An error occurred: Test client-side error message');
      }
    });
  });

  it('should handle server-side error', () => {
    const serverSideError = new HttpErrorResponse({
      error: 'Http failure response for (unknown url): 500 Internal Server Error',
      status: 500,
      statusText: 'Internal Server Error'
    });

    const result = service.handleError(serverSideError);

    expect(loggerSpy.error).toHaveBeenCalledWith(`BlogService :: Encountered an error: Something went wrong. (Internal Server Error)`);
    result.subscribe({
      error: (error: Error) => {
        expect(error.message).toBe('Something went wrong. (Internal Server Error)');
      }
    });
  });

  it('should throw default error when error object has no message', () => {
    const errorWithoutMessage = new HttpErrorResponse({
      error: {},
      status: 400,
      statusText: 'Bad Request'
    });

    const result = service.handleError(errorWithoutMessage);

    expect(loggerSpy.error).toHaveBeenCalledWith(`BlogService :: Encountered an error: Something went wrong. (Bad Request)`);
    result.subscribe({
      error: (error: Error) => {
        expect(error.message).toBe('Something went wrong. (Bad Request)');
      }
    });
  });
});
