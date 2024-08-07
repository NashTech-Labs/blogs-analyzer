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
  fileUploadErrorMessage: string | null = null;
  errorContext: 'title' | 'author' | 'id' | null = null;
  fileUrl: any

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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files?.[0]) {
      const file = input.files[0];
      const fileType = file.name.split('.').pop()?.toLowerCase();

      if (fileType === 'doc' || fileType === 'docx') {
        this.fileUploadErrorMessage = null;
        const reader = new FileReader();

        reader.onload = (e) => {
          this.fileUrl = e.target?.result as string;
          this.router.navigate(['/quality-check'], { state: { url: this.fileUrl } });
        };
        reader.readAsDataURL(file);
      } else {
        this.fileUploadErrorMessage = `Invalid file type. <br> Please upload a .doc/.docx file.`;
      }
    }
  }
}
