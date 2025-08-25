import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaiMatHangEdit } from './loai-mat-hang-edit';

describe('LoaiMatHangEdit', () => {
  let component: LoaiMatHangEdit;
  let fixture: ComponentFixture<LoaiMatHangEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoaiMatHangEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoaiMatHangEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
