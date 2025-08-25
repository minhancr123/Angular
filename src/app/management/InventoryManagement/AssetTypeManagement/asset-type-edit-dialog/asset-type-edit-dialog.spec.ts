import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetTypeEditDialog } from './asset-type-edit-dialog';

describe('AssetTypeEditDialog', () => {
  let component: AssetTypeEditDialog;
  let fixture: ComponentFixture<AssetTypeEditDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetTypeEditDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetTypeEditDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
