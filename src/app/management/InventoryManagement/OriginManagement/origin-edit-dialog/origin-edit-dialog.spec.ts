import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OriginEditDialog } from './origin-edit-dialog';

describe('OriginEditDialog', () => {
  let component: OriginEditDialog;
  let fixture: ComponentFixture<OriginEditDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OriginEditDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OriginEditDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
