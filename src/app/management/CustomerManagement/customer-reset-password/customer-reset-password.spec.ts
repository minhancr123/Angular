import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerResetPassword } from './customer-reset-password';

describe('CustomerResetPassword', () => {
  let component: CustomerResetPassword;
  let fixture: ComponentFixture<CustomerResetPassword>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerResetPassword]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerResetPassword);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
