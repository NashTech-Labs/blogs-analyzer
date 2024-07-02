import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { NGXLogger } from 'ngx-logger';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private logger: NGXLogger) {
  }

  searchPostsByTitle(title: string): Observable<any> {
    const url = `${this.baseUrl}/wordpress/posts-by-title?title=${encodeURIComponent(title)}`;
    this.logger.debug(`BlogService :: Fetching post by Title: ${title} :: URL: ${url}`);
    return this.http.get(url, {responseType: 'text'}).pipe(
      catchError(this.handleError)
    );
  }

  getAllPosts(page: number, pageSize: number): Observable<any> {
    const url = `${this.baseUrl}/wordpress?page=${page}&size=${pageSize}`;
    this.logger.debug(`BlogService :: Fetching All Posts :: URL: ${url}`);
    return this.http.get(url).pipe(
      map((response: any) => ({
        posts: response.posts,
        totalPages: response.totalPages
      })),
      catchError(this.handleError)
    );
  }

  getPostById(id: number): Observable<any> {
    const url = `${this.baseUrl}/wordpress/posts/${id}`;
    this.logger.debug(`BlogService :: Fetching post by Blog ID: ${id} :: URL: ${url}`);
    return this.http.get(url, {responseType: 'text'}).pipe(
      catchError(this.handleError)
    );
  }

  getPostByAuthorId(id: number): Observable<any> {
    const url = `${this.baseUrl}/wordpress/posts-by-author?authorId=${id}`;
    this.logger.debug(`BlogService :: Fetching post by Author ID: ${id} :: URL: ${url}`);
    return this.http.get(url, {responseType: 'text'}).pipe(
      catchError(this.handleError)
    );
  }

  getBlogQuality(prompt: string): Observable<any> {
    const url = `${this.baseUrl}/gemini/v1/review`;
    this.logger.debug(`BlogService :: Checking Blog's Quality with prompt ${prompt} :: URL: ${url}`);
    return this.http.post(url, prompt, {responseType: 'text'}).pipe(
      catchError(this.handleError)
    );
  }

  handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      errorMessage = `Server-side error: ${error.message}`;
    }
    this.logger.error(`BlogService :: Encountered an error: ${errorMessage}`);
    return throwError(() => new Error(errorMessage));
  }
}
