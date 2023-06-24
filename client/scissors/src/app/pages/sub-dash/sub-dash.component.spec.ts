import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubDashComponent } from './sub-dash.component';

describe('SubDashComponent', () => {
  let component: SubDashComponent;
  let fixture: ComponentFixture<SubDashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubDashComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
