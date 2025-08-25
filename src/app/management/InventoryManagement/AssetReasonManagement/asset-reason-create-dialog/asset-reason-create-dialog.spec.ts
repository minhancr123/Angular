import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetReasonCreateDialog } from './asset-reason-create-dialog';

describe('AssetReasonCreateDialog', () => {
  let component: AssetReasonCreateDialog;
  let fixture: ComponentFixture<AssetReasonCreateDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetReasonCreateDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetReasonCreateDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
