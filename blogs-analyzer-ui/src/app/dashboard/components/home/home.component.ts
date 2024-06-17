import { Component } from '@angular/core';
import { BlogService } from "../../../services/blog.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  searchTitle!: string;
  blogId!: number;
  authorId!: number;

  constructor(private blogService: BlogService, private router: Router) {
  }

  ngOnInit(): void {
  }

  searchByTitle() {
    if (this.searchTitle) {
      this.blogService.searchPostsByTitle(this.searchTitle).subscribe((data: any[]) => {
        this.router.navigate(['/quality-check'], {state: {data: data}});
      });
    }
  }

  getBlogById() {
    if (this.blogId) {
      this.blogService.getPostById(this.blogId).subscribe((data: any[]) => {
        this.router.navigate(['/quality-check'], {state: {data: data}});
      });
    }
  }

  getBlogByAuthorId() {
    if (this.authorId) {
      this.blogService.getPostByAuthorId(this.authorId).subscribe((data: any[]) => {
        this.router.navigate(['/quality-check'], {state: {data: data}});
      });
    }
  }
}
