import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BlogService } from "../../../services/blog.service";

@Component({
  selector: 'app-tabular-view',
  templateUrl: './tabular-view.component.html',
  styleUrls: ['./tabular-view.component.scss']
})
export class TabularViewComponent implements OnInit {
  protected columnDefs: any[];
  protected rowData: any[];
  loading: boolean = true;
  currentPage: number = 1;
  pageSize: number = 10;
  isLastPage: boolean = false;
  totalPages: number = 1;
  @Output() clickEvent = new EventEmitter<number>();

  constructor(private blogService: BlogService, private router: Router) {
    this.columnDefs = [
      {headerName: 'ID', field: 'id', width: 100},
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
        cellRenderer: function () {
          return '<button class="check-btn">Quality Check</button>';
        },
        onCellClicked: (params: { data: { id: number; }; }) => {
          console.log('Cell clicked with ID:', params.data.id);

          this.blogService.getPostById(params.data.id).subscribe((response: any) => {
            this.router.navigate(['/quality-check'], {state: {data: response}});
          });
        }
      }
    ]
    this.rowData = [];
  }


  ngOnInit(): void {
    this.fetchPosts(this.currentPage);
  }

  fetchPosts(page: number): void {
    this.loading = true;
    this.blogService.getAllPosts(page, this.pageSize).subscribe(
      (data: any) => {
        this.rowData = data.posts.map((post: any) => {
          return {
            id: post.id,
            authorName: post.authorName,
            authorId: post.authorId,
            title: post.title,
            url: post.url,
            status: post.status
          };
        });
        this.totalPages = data.totalPages;
        this.isLastPage = data.isLastPage;
        this.loading = false;
      },
      (error: any) => {
        console.error('Error fetching posts:', error);
        this.loading = false;
      }
    );
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
