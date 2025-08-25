import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetReasonEditDialog } from './asset-reason-edit-dialog';

describe('AssetReasonEditDialog', () => {
  let component: AssetReasonEditDialog;
  let fixture: ComponentFixture<AssetReasonEditDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetReasonEditDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetReasonEditDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
