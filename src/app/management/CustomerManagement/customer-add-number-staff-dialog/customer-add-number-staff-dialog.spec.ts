import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerAddNumberStaffDialog } from './customer-add-number-staff-dialog';

describe('CustomerAddNumberStaffDialog', () => {
  let component: CustomerAddNumberStaffDialog;
  let fixture: ComponentFixture<CustomerAddNumberStaffDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerAddNumberStaffDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerAddNumberStaffDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
