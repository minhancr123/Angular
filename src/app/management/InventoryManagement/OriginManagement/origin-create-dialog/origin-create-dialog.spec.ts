import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OriginCreateDialog } from './origin-create-dialog';

describe('OriginCreateDialog', () => {
  let component: OriginCreateDialog;
  let fixture: ComponentFixture<OriginCreateDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OriginCreateDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OriginCreateDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
