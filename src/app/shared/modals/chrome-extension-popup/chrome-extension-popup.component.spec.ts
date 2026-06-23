import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChromeExtensionPopupComponent } from './chrome-extension-popup.component';

describe('ChromeExtensionPopupComponent', () => {
  let component: ChromeExtensionPopupComponent;
  let fixture: ComponentFixture<ChromeExtensionPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChromeExtensionPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChromeExtensionPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
