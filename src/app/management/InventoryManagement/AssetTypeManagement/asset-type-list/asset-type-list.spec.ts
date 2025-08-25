import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetTypeList } from './asset-type-list';

describe('AssetTypeList', () => {
  let component: AssetTypeList;
  let fixture: ComponentFixture<AssetTypeList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetTypeList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetTypeList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
