import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawerModalLayoutComponent } from './drawer-modal-layout.component';

describe('DrawerModalLayoutComponent', () => {
  let component: DrawerModalLayoutComponent;
  let fixture: ComponentFixture<DrawerModalLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawerModalLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawerModalLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
