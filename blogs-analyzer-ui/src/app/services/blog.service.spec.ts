import { TestBed } from '@angular/core/testing';

import { BlogService } from './blog.service';
import { QualityCheckComponent } from "../quality-check/quality-check.component";
import { HeaderComponent } from "../dashboard/components/header/header.component";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientModule } from "@angular/common/http";

describe('BlogService', () => {
  let service: BlogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BlogService],
      declarations: [QualityCheckComponent, HeaderComponent],
      imports: [RouterTestingModule, HttpClientModule]
    });
    service = TestBed.inject(BlogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
