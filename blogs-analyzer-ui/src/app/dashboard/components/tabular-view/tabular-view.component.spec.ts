import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabularViewComponent } from './tabular-view.component';
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientModule } from "@angular/common/http";
import { MatCardModule } from "@angular/material/card";
import { NO_ERRORS_SCHEMA } from "@angular/core";

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
});
