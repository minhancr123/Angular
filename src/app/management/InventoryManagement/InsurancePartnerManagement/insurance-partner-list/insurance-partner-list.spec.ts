import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsurancePartnerList } from './insurance-partner-list';

describe('InsurancePartnerList', () => {
  let component: InsurancePartnerList;
  let fixture: ComponentFixture<InsurancePartnerList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsurancePartnerList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsurancePartnerList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
