import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DVTComponent } from './dvtcomponent';

describe('DVTComponent', () => {
  let component: DVTComponent;
  let fixture: ComponentFixture<DVTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DVTComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DVTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
