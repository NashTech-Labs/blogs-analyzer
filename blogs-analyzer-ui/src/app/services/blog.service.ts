import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private baseUrl = 'http://localhost:8080/api';


  constructor(private http: HttpClient) {
  }

  searchPostsByTitle(title: string): Observable<any> {
    const url = `${this.baseUrl}/wordpress/posts-by-title?title=${encodeURIComponent(title)}`;
    return this.http.get(url, {responseType: 'text'});
  }

  getAllPosts(page: number, pageSize: number): Observable<any> {
    const url = `${this.baseUrl}/wordpress?page=${page}&size=${pageSize}`;
    return this.http.get(url).pipe(
      map((response: any) => {
        return {
          posts: response.posts,
          totalPages: response.totalPages
        };
      })
    );
  }

  getPostById(id: number): Observable<any> {
    const url = `${this.baseUrl}/wordpress/posts/${id}`;
    return this.http.get(url, {responseType: 'text'});
  }

  getPostByAuthorId(id: number): Observable<any> {
    const url = `${this.baseUrl}/wordpress/posts-by-author?authorId=${id}`;
    return this.http.get(url, {responseType: 'text'});
  }

  getBlogQuality(prompt: string): Observable<any> {
    const url = `${this.baseUrl}/gemini/v1/review`;
    const params = new HttpParams().set('prompt', prompt);
    return this.http.get(url, { params, responseType: 'text' });
  }
}