import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubgirosComponent } from './subgiros.component';

describe('SubgirosComponent', () => {
  let component: SubgirosComponent;
  let fixture: ComponentFixture<SubgirosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubgirosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubgirosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
