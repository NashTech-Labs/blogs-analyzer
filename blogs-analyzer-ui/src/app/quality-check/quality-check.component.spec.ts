import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QualityCheckComponent } from './quality-check.component';
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientModule } from "@angular/common/http";
import { HeaderComponent } from "../dashboard/components/header/header.component";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";

describe('QualityCheckComponent', () => {
  let component: QualityCheckComponent;
  let fixture: ComponentFixture<QualityCheckComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QualityCheckComponent, HeaderComponent],
      imports: [RouterTestingModule, HttpClientModule, MatIconModule, MatCardModule]

    });
    fixture = TestBed.createComponent(QualityCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
