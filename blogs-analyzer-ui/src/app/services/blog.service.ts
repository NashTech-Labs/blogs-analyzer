import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private baseUrl = 'http://localhost:8080/api/wordpress';


  constructor(private http: HttpClient) {
  }

  searchPostsByTitle(title: string): Observable<any> {
    const url = `${this.baseUrl}/posts-by-title?title=${encodeURIComponent(title)}`;
    return this.http.get(url, {responseType: 'text'});
  }

  getAllPosts(page: number, pageSize: number): Observable<any> {
    const url = `${this.baseUrl}?page=${page}&size=${pageSize}`;
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
    const url = `${this.baseUrl}/posts/${id}`;
    return this.http.get(url, {responseType: 'text'});
  }

  getPostByAuthorId(id: number): Observable<any> {
    const url = `${this.baseUrl}/posts-by-author?authorId=${id}`;
    return this.http.get(url, {responseType: 'text'});
  }
}
