import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerManagementList } from './customer-management-list';

describe('CustomerManagementList', () => {
  let component: CustomerManagementList;
  let fixture: ComponentFixture<CustomerManagementList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerManagementList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerManagementList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
