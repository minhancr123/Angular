import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupAssetEditDialog } from './group-asset-edit-dialog';

describe('GroupAssetEditDialog', () => {
  let component: GroupAssetEditDialog;
  let fixture: ComponentFixture<GroupAssetEditDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupAssetEditDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupAssetEditDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
