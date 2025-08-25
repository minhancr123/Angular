import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DVTCreateDialog } from './dvtcreate-dialog';

describe('DVTCreateDialog', () => {
  let component: DVTCreateDialog;
  let fixture: ComponentFixture<DVTCreateDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DVTCreateDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DVTCreateDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
