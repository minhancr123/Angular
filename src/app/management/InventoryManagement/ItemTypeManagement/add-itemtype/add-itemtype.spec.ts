import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddItemType } from './add-itemtype';
describe('AddItemType', () => {
  let component: AddItemType;
  let fixture: ComponentFixture<AddItemType>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddItemType]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddItemType);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
