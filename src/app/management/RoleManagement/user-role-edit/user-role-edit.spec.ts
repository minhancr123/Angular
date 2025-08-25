import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRoleEdit } from './user-role-edit';

describe('UserRoleEdit', () => {
  let component: UserRoleEdit;
  let fixture: ComponentFixture<UserRoleEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserRoleEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserRoleEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
