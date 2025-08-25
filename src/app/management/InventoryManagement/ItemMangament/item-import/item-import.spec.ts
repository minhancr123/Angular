import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemImport } from './item-import';

describe('ItemImport', () => {
  let component: ItemImport;
  let fixture: ComponentFixture<ItemImport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemImport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemImport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
