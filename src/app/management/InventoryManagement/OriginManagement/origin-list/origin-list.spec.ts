import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OriginList } from './origin-list';

describe('OriginList', () => {
  let component: OriginList;
  let fixture: ComponentFixture<OriginList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OriginList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OriginList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
