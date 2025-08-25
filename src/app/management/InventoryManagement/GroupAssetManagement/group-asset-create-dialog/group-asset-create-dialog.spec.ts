import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupAssetCreateDialog } from './group-asset-create-dialog';

describe('GroupAssetCreateDialog', () => {
  let component: GroupAssetCreateDialog;
  let fixture: ComponentFixture<GroupAssetCreateDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupAssetCreateDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupAssetCreateDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
