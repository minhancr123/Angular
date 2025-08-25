import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupAssetList } from './group-asset-list';

describe('GroupAssetList', () => {
  let component: GroupAssetList;
  let fixture: ComponentFixture<GroupAssetList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupAssetList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupAssetList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
