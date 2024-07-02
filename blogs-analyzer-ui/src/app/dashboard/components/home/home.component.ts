import { Component } from '@angular/core';
import { BlogService } from '../../../services/blog.service';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  searchTitle!: string;
  blogId!: number;
  authorId!: number;
  errorMessage: string | null = null;
  errorContext: 'title' | 'author' | 'id' | null = null;

  constructor(
    private blogService: BlogService,
    private router: Router,
    private logger: NGXLogger) {
  }

  searchByTitle() {
    if (this.searchTitle) {
      this.logger.debug(`Searching posts by title: ${this.searchTitle}`);
      this.blogService.searchPostsByTitle(this.searchTitle).subscribe({
        next: (data: any[]) => {
          this.errorMessage = null;
          this.router.navigate(['/quality-check'], {state: {data: data}});
        },
        error: (error: Error) => {
          this.errorContext = 'title';
          this.errorMessage = error.message;
          this.logger.error(`Error searching posts by title: ${error.message}`);
        }
      });
    }
  }

  getBlogById() {
    if (this.blogId) {
      this.logger.debug(`Fetching post by ID: ${this.blogId}`);
      this.blogService.getPostById(this.blogId).subscribe({
        next: (data: any[]) => {
          this.errorMessage = null;
          this.router.navigate(['/quality-check'], {state: {data: data}});
        },
        error: (error: Error) => {
          this.errorContext = 'id';
          this.errorMessage = error.message;
          this.logger.error(`Error fetching post by ID: ${error.message}`);
        }
      });
    }
  }

  getBlogByAuthorId() {
    if (this.authorId) {
      this.logger.debug(`Fetching posts by author ID: ${this.authorId}`);
      this.blogService.getPostByAuthorId(this.authorId).subscribe({
        next: (data: any[]) => {
          this.errorMessage = null;
          this.router.navigate(['/quality-check'], {state: {data: data}});
        },
        error: (error: Error) => {
          this.errorContext = 'author';
          this.errorMessage = error.message;
          this.logger.error(`Error fetching posts by author ID: ${error.message}`);
        }
      });
    }
  }
}
