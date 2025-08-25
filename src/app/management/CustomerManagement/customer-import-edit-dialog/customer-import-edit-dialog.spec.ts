import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerImportEditDialog } from './customer-import-edit-dialog';

describe('CustomerImportEditDialog', () => {
  let component: CustomerImportEditDialog;
  let fixture: ComponentFixture<CustomerImportEditDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerImportEditDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerImportEditDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
