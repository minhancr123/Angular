import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetTypeCreateDialog } from './asset-type-create-dialog';

describe('AssetTypeCreateDialog', () => {
  let component: AssetTypeCreateDialog;
  let fixture: ComponentFixture<AssetTypeCreateDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetTypeCreateDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetTypeCreateDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
