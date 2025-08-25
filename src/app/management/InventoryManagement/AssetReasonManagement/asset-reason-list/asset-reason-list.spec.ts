import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetReasonList } from './asset-reason-list';

describe('AssetReasonList', () => {
  let component: AssetReasonList;
  let fixture: ComponentFixture<AssetReasonList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetReasonList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetReasonList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
