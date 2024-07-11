import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BlogService } from "../../../services/blog.service";
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-tabular-view',
  templateUrl: './tabular-view.component.html',
  styleUrls: ['./tabular-view.component.scss']
})
export class TabularViewComponent implements OnInit {
  columnDefs: any[];
  rowData: any[];
  loading: boolean = true;
  currentPage: number = 1;
  pageSize: number = 10;
  isLastPage: boolean = false;
  totalPages: number = 1;
  @Output() clickEvent = new EventEmitter<number>();
  errorMessage: string | null = null;

  constructor(public blogService: BlogService, public router: Router, public logger: NGXLogger) {
    this.columnDefs = [
      {headerName: 'Blog ID', field: 'id', width: 100},
      {headerName: 'Title', field: 'title.rendered', flex: 2},
      {headerName: 'Author Name', field: 'authorName', flex: 1},
      {headerName: 'Status', field: 'status', flex: 1},
      {headerName: 'Author ID', field: 'authorId', flex: 1},
      {
        headerName: 'View',
        field: 'url',
        flex: 1,
        cellRenderer: function (params: { value: string; }) {
          return '<mat-icon class="material-icons visibility-icon" style="cursor: pointer; color: #0f0092">visibility</mat-icon>';
        },
        onCellClicked: function (params: { data: { url: string; }; }) {
          window.open(params.data.url, '_blank');
        },
      },
      {
        headerName: 'Quality Check',
        field: 'id',
        flex: 1,
        cellRenderer: () => {
          return '<button class="check-btn">Quality Check</button>';
        },
        onCellClicked: (params: { data: { id: number; }; }) => {
          this.logger.debug(`Initiating quality check for blog ID: ${params.data.id}`);
          this.blogService.getPostById(params.data.id).subscribe({
            next: (response: any) => {
              this.router.navigate(['/quality-check'], {state: {data: response}});
            },
            error: (error: any) => {
              this.logger.error(`Error fetching post by ID ${params.data.id}: ${error.message}`);
              this.errorMessage = `Failed to fetch Data. Please try again later.<br><br>${error.message}`;
            }
          });
        }
      }
    ];
    this.rowData = [];
  }

  ngOnInit(): void {
    this.fetchPosts(this.currentPage);
  }

  fetchPosts(page: number): void {
    this.loading = true;
    this.errorMessage = null;
    this.logger.debug(`Fetching posts for page ${page} with page size ${this.pageSize}`);
    this.blogService.getAllPosts(page, this.pageSize).subscribe({
      next: (data: any) => {
        this.rowData = data.posts.map((post: any) => ({
          id: post.id,
          authorName: post.authorName,
          authorId: post.authorId,
          title: post.title,
          url: post.url,
          status: post.status
        }));
        this.totalPages = data.totalPages;
        this.isLastPage = data.isLastPage;
        this.loading = false;
      },
      error: (error: any) => {
        this.loading = false;
        this.errorMessage = `Failed to fetch Data. Please try again later.<br><br>${error.message}`;
        this.logger.error(`Error fetching posts for page ${page}: ${error.message}`);
      }
    });
  }

  onPageChange(page: number): void {
    if (page < 1 || (this.isLastPage && page > this.currentPage)) {
      return;
    }
    this.currentPage = page;
    this.fetchPosts(this.currentPage);
  }

  navigateToFirstPage(): void {
    this.onPageChange(1);
  }

  navigateToLastPage(): void {
    this.onPageChange(this.totalPages);
  }
}
