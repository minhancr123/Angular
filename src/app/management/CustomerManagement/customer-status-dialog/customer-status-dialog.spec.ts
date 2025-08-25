import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerStatusDialog } from './customer-status-dialog';

describe('CustomerStatusDialog', () => {
  let component: CustomerStatusDialog;
  let fixture: ComponentFixture<CustomerStatusDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerStatusDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerStatusDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
