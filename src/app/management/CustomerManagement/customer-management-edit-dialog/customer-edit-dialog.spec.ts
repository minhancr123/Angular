import { ComponentFixture, TestBed } from '@angular/core/testing';


import { CustomerManagementEditDialogComponent } from './customer-edit-dialog';
describe('CustomerAddDialog', () => {
  let component: CustomerManagementEditDialogComponent;
  let fixture: ComponentFixture<CustomerManagementEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerManagementEditDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerManagementEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
