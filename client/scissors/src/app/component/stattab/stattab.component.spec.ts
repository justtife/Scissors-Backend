import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StattabComponent } from './stattab.component';

describe('StattabComponent', () => {
  let component: StattabComponent;
  let fixture: ComponentFixture<StattabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StattabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StattabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
