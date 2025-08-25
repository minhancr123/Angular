import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsurancePartnerEditDialog } from './insurance-partner-edit-dialog';

describe('InsurancePartnerEditDialog', () => {
  let component: InsurancePartnerEditDialog;
  let fixture: ComponentFixture<InsurancePartnerEditDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsurancePartnerEditDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsurancePartnerEditDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
