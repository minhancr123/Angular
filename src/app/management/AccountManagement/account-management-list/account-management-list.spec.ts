import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountManagementList } from './account-management-list';

describe('AccountManagementList', () => {
  let component: AccountManagementList;
  let fixture: ComponentFixture<AccountManagementList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountManagementList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountManagementList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
