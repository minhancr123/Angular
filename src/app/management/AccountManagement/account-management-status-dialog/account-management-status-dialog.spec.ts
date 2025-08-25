import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountManagementStatusDialog } from './account-management-status-dialog';

describe('AccountManagementStatusDialog', () => {
  let component: AccountManagementStatusDialog;
  let fixture: ComponentFixture<AccountManagementStatusDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountManagementStatusDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountManagementStatusDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
