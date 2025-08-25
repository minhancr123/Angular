import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { ResultModel } from 'src/app/_metronic/core/models/_base.model';
import { GroupingState, ITableState, PaginatorState, SortState } from 'src/app/_metronic/shared/crud-table';
import { HttpUtilsService } from 'src/app/_core/utils/http-utils.service';
import { environment } from 'src/environments/environment';
import { AssetTypeModel, GroupAssetModel } from '../Model/asset-management.model';

const API_GROUP_ASSET_TYPE = `${environment.ApiRoot}/PropertyManagement`;
const DEFAULT_STATE: ITableState = {
  filter: {},
  paginator: new PaginatorState(),
  sorting: new SortState(),
  searchTerm: '',
  grouping: new GroupingState(),
  entityId: undefined,
};

@Injectable({ providedIn: 'root' })
export class GroupAssetService {
  private http = inject(HttpClient);
  private httpUtils = inject(HttpUtilsService);

  public Visible: boolean;
  public HasPermission: boolean;
  private _items$ = new BehaviorSubject<GroupAssetModel[]>([]);
  private _isLoading$ = new BehaviorSubject<boolean>(false);
  private _errorMessage = new BehaviorSubject<string>('');
  private _tableState$ = new BehaviorSubject<ITableState>({ ...DEFAULT_STATE });

  readonly items$ = this._items$.asObservable();
  readonly isLoading$ = this._isLoading$.asObservable();

  get paginator() {
    return this._tableState$.value.paginator;
  }
  get sorting() {
    return this._tableState$.value.sorting;
  }
  get filter() {
    return this._tableState$.value.filter;
  }
  get grouping() {
    return this._tableState$.value.grouping;
  }
  patchState(patch: Partial<ITableState>): void {
    const newState = { ...this._tableState$.value, ...patch };
    this._tableState$.next(newState);
    this.fetch();
  }
/**
   * Fetch data for route guard - trả về Promise để có thể await
   */
  fetchForGuard(): Promise<void> {
    return new Promise((resolve, reject) => {
      this._isLoading$.next(true);
      this._errorMessage.next('');
      
      this.findData(this._tableState$.value)
        .pipe(
          tap((res: ResultModel<GroupAssetModel>) => {
            if (res && res.status === 1) {
              this.Visible = res.Visible;
              this.HasPermission = res.HasPermission;
              this._items$.next(res.data);
              this._tableState$.value.paginator.total = res.panigator.TotalCount;
              this._tableState$.value.paginator.recalculatePaginator(res.panigator.TotalCount);
              this._tableState$.next({ ...this._tableState$.value });
              resolve(); // ✅ Resolve khi thành công
            } else {
              this._items$.next([]);
              this._tableState$.value.paginator.recalculatePaginator(0);
              this._tableState$.next({ ...this._tableState$.value });
              this._errorMessage.next(res.error?.message ?? 'Lỗi không xác định');
              reject(new Error(res.error?.message ?? 'Lỗi không xác định'));
            }
          }),
          catchError((err) => {
            this._errorMessage.next('Lỗi kết nối');
            this._items$.next([]);
            reject(err); // ✅ Reject khi có lỗi
            return of();
          }),
          finalize(() => this._isLoading$.next(false))
        ).subscribe();
    });
  }
  fetch(): void {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    this.findData(this._tableState$.value).pipe(
      tap((res: ResultModel<GroupAssetModel>) => {
        if (res && res.status === 1) {
          this.Visible = res.Visible;
          this.HasPermission = res.HasPermission;
          this._items$.next(res.data);
          this._tableState$.value.paginator.recalculatePaginator(res.panigator.TotalCount);
        } else {
          this._items$.next([]);
          this._errorMessage.next(res.error?.message ?? 'Lỗi không xác định');
        }
      }),
      catchError(() => {
        this._errorMessage.next('Lỗi kết nối');
        return of();
      }),
      finalize(() => this._isLoading$.next(false))
    ).subscribe();
  }

  private findData(state: ITableState): Observable<any> {
    const headers = this.httpUtils.getHTTPHeaders();
    const url = `${API_GROUP_ASSET_TYPE}/getAllGroupPropertyType`;
    return this.http.post<any>(url, state, { headers });
  }

  create(item: AssetTypeModel): Observable<any> {
    const url = `${API_GROUP_ASSET_TYPE}/addGroupPropertyType`;
    return this.http.post<any>(url, item, { headers: this.httpUtils.getHTTPHeaders() });
  }

  update(item: AssetTypeModel): Observable<any> {
    const url = `${API_GROUP_ASSET_TYPE}/updateGroupPropertyType`;
    return this.http.post<any>(url, item, { headers: this.httpUtils.getHTTPHeaders() });
  }

  delete(id: number): Observable<any> {
    const url = `${API_GROUP_ASSET_TYPE}/GroupPropertyType/${id}`;
    return this.http.delete<any>(url, { headers: this.httpUtils.getHTTPHeaders() });
  }
}
