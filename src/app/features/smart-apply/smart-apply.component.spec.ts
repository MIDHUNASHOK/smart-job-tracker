import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartApplyComponent } from './smart-apply.component';

describe('SmartApplyComponent', () => {
  let component: SmartApplyComponent;
  let fixture: ComponentFixture<SmartApplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SmartApplyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SmartApplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
