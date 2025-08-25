import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemEdit } from './item-edit';

describe('ItemEdit', () => {
  let component: ItemEdit;
  let fixture: ComponentFixture<ItemEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
