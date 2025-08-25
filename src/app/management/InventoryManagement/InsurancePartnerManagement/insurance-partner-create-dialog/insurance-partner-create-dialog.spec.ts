import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsurancePartnerCreateDialog } from './insurance-partner-create-dialog';

describe('InsurancePartnerCreateDialog', () => {
  let component: InsurancePartnerCreateDialog;
  let fixture: ComponentFixture<InsurancePartnerCreateDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsurancePartnerCreateDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsurancePartnerCreateDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
