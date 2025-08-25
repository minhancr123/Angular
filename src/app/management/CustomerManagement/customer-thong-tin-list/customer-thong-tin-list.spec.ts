import { ComponentFixture, TestBed } from '@angular/core/testing';


import { CustomerAppListComponent } from './customer-thong-tin-list';
describe('CustomerAppListComponent', () => {
  let component: CustomerAppListComponent;
  let fixture: ComponentFixture<CustomerAppListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerAppListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerAppListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
