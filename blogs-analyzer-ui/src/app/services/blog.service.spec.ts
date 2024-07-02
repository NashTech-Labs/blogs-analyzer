import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BlogService } from './blog.service';
import { environment } from '../../environments/environment';

describe('BlogService', () => {
  let service: BlogService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BlogService],
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(BlogService);
    httpMock = TestBed.inject(HttpTestingController);
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
});
