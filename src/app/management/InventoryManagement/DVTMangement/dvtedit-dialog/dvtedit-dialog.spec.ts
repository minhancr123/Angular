import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DVTEditDialog } from './dvtedit-dialog';

describe('DVTEditDialog', () => {
  let component: DVTEditDialog;
  let fixture: ComponentFixture<DVTEditDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DVTEditDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DVTEditDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
