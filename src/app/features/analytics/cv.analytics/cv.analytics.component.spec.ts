import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvAnalyticsComponent } from './cv.analytics.component';

describe('CvAnalyticsComponent', () => {
  let component: CvAnalyticsComponent;
  let fixture: ComponentFixture<CvAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CvAnalyticsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CvAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
