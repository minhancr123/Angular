import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerAddDeleteAppDialog } from './customer-add-delete-app-dialog';

describe('CustomerAddDeleteAppDialog', () => {
  let component: CustomerAddDeleteAppDialog;
  let fixture: ComponentFixture<CustomerAddDeleteAppDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerAddDeleteAppDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerAddDeleteAppDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
