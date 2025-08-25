import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandCreateDialog } from './brand-create-dialog';

describe('BrandCreateDialog', () => {
  let component: BrandCreateDialog;
  let fixture: ComponentFixture<BrandCreateDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandCreateDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandCreateDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
