import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerGiaHanEditDialog } from './customer-gia-han-edit-dialog';

describe('CustomerGiaHanEditDialog', () => {
  let component: CustomerGiaHanEditDialog;
  let fixture: ComponentFixture<CustomerGiaHanEditDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerGiaHanEditDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerGiaHanEditDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
