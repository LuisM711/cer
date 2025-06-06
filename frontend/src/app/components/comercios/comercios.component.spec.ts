import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComerciosComponent } from './comercios.component';

describe('ComerciosComponent', () => {
  let component: ComerciosComponent;
  let fixture: ComponentFixture<ComerciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComerciosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComerciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
