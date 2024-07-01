import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabularViewComponent } from './tabular-view.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatCardModule } from "@angular/material/card";
import { HttpClientModule } from "@angular/common/http";
import { RouterTestingModule } from "@angular/router/testing";

describe('TabularViewComponent', () => {
  let component: TabularViewComponent;
  let fixture: ComponentFixture<TabularViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TabularViewComponent],
      imports: [RouterTestingModule, HttpClientModule, MatCardModule],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(TabularViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change page and fetch posts on page change', () => {
    spyOn(component, 'fetchPosts');
    component.onPageChange(2);

    expect(component.currentPage).toBe(2);
    expect(component.fetchPosts).toHaveBeenCalledWith(2);
  });

  it('should not change page if page is invalid', () => {
    spyOn(component, 'fetchPosts');

    component.onPageChange(0);
    expect(component.currentPage).toBe(1);
    expect(component.fetchPosts).not.toHaveBeenCalled();

    component.isLastPage = true;
    component.currentPage = 1;
    component.onPageChange(2);
    expect(component.currentPage).toBe(1);
    expect(component.fetchPosts).not.toHaveBeenCalled();
  });

  it('should navigate to the first page', () => {
    spyOn(component, 'onPageChange');
    component.navigateToFirstPage();

    expect(component.onPageChange).toHaveBeenCalledWith(1);
  });

  it('should navigate to the last page', () => {
    component.totalPages = 5;
    spyOn(component, 'onPageChange');
    component.navigateToLastPage();

    expect(component.onPageChange).toHaveBeenCalledWith(5);
  });
});
