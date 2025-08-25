import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountManagementEditDialog } from './account-management-edit-dialog';

describe('AccountManagementEditDialog', () => {
  let component: AccountManagementEditDialog;
  let fixture: ComponentFixture<AccountManagementEditDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountManagementEditDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountManagementEditDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
