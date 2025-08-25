import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemTypeList } from './item-type-list';

describe('ItemTypeList', () => {
  let component: ItemTypeList;
  let fixture: ComponentFixture<ItemTypeList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemTypeList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemTypeList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
