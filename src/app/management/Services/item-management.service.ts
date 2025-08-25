import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import {
  BehaviorSubject,
  catchError,
  finalize,
  map,
  Observable,
  of,
  tap,
} from "rxjs";
import { HttpUtilsService } from "src/app/_core/utils/http-utils.service";
import { environment } from "src/environments/environment";
import { MatHang } from "../Model/Inventory-management.model";
import { ResultModel } from "src/app/_metronic/core/models/_base.model";
import {
  GroupingState,
  ITableState,
  PaginatorState,
  SortState,
} from "src/app/_metronic/shared/crud-table";

const API_ITEM_URL = `${environment.ApiRoot}/InventoryManagement`;
const DEFAULT_STATE: ITableState = {
  filter: {},
  paginator: new PaginatorState(),
  sorting: new SortState(),
  searchTerm: '',
  grouping: new GroupingState(),
  entityId: undefined,
};

@Injectable({ providedIn: 'root' })
export class MatHangService {
  private http = inject(HttpClient);
  private httpUtils = inject(HttpUtilsService);

  public Visible : boolean;
  public HasPermission: boolean;
  private _item$ = new BehaviorSubject<MatHang[]>([]);
  private _isLoading$ = new BehaviorSubject<boolean>(false);
  private _isFirstLoading$ = new BehaviorSubject<boolean>(true);
  private _errorMessage = new BehaviorSubject<string>('');
  private _tableState$ = new BehaviorSubject<ITableState>({ ...DEFAULT_STATE });

  /** ---------- Getters (public observables) ---------- */

  readonly item$ = this._item$.asObservable();
  readonly isLoading$ = this._isLoading$.asObservable();
  readonly isFirstLoading$ = this._isFirstLoading$.asObservable();
  readonly errorMessage$ = this._errorMessage.asObservable();

  /** ---------- State accessors ---------- */

  get paginator() {
    return this._tableState$.value.paginator;
  }

  get filter() {
    return this._tableState$.value.filter;
  }

  get sorting() {
    return this._tableState$.value.sorting;
  }

  get searchTerm() {
    return this._tableState$.value.searchTerm;
  }

  get grouping() {
    return this._tableState$.value.grouping;
  }

  /** ---------- State patching ---------- */

  patchState(patch: Partial<ITableState>): void {
    this.patchStateWithoutFetch(patch);
    this.fetch();
  }

  fetchStateSort(patch: Partial<ITableState>): void {
    this.patchStateWithoutFetch(patch);
    this.fetch();
  }

  patchStateWithoutFetch(patch: Partial<ITableState>): void {
    const newState = { ...this._tableState$.value, ...patch };
    this._tableState$.next(newState);
  }

  /** ---------- Fetch data ---------- */

/**
 * Fetch data for route guard - trả về Promise để có thể await
 */
fetchForGuard(): Promise<void> {
  return new Promise((resolve, reject) => {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    
    this.findData(this._tableState$.value)
      .pipe(
        tap((res: ResultModel<MatHang>) => {
          if (res && res.status === 1) {
            this.Visible = res.Visible;
            this.HasPermission = res.HasPermission;
            this._item$.next(res.data);
            this._tableState$.value.paginator.total = res.panigator.TotalCount;
            this._tableState$.value.paginator.recalculatePaginator(res.panigator.TotalCount);
            this._tableState$.next({ ...this._tableState$.value });
            resolve(); // ✅ Resolve khi thành công
          } else {
            this._item$.next([]);
            this._tableState$.value.paginator.recalculatePaginator(0);
            this._tableState$.next({ ...this._tableState$.value });
            this._errorMessage.next(res.error?.message ?? 'Lỗi không xác định');
            reject(new Error(res.error?.message ?? 'Lỗi không xác định'));
          }
        }),
        catchError((err) => {
          this._errorMessage.next('Lỗi kết nối');
          this._item$.next([]);
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
    console.log('Fetching data with state:', this._tableState$.value);
    this.findData(this._tableState$.value)
      .pipe(
        tap((res: ResultModel<MatHang>) => {
          if (res && res.status === 1) {
            this.Visible = res.Visible;
            this.HasPermission = res.HasPermission;
            this._item$.next(res.data);
            this._tableState$.value.paginator.total = res.panigator.TotalCount;
            this._tableState$.value.paginator.recalculatePaginator(res.panigator.TotalCount);
            this._tableState$.next({ ...this._tableState$.value });
          } else {
            this._item$.next([]);
            this._tableState$.value.paginator.recalculatePaginator(0);
            this._tableState$.next({ ...this._tableState$.value });
            this._errorMessage.next(res.error?.message ?? 'Lỗi không xác định');
          }
          console.log('Fetch data completed:', res);
        }),
        catchError((err) => {
          this._errorMessage.next('Lỗi kết nối');
          this._item$.next([]);
          return of();
        }),
        finalize(() => this._isLoading$.next(false))
      ).subscribe();
  }

  /** ---------- API Methods ---------- */

  private findData(state: ITableState): Observable<any> {
    const headers = this.httpUtils.getHTTPHeaders();
    const url = `${API_ITEM_URL}/GetAllItem`;
    return this.http.post<any>(url, state, { headers });
  }

  createMatHang(item: MatHang): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${API_ITEM_URL}/addItem`;
    return this.http.post<any>(url, item, { headers: httpHeaders });
  }
  uploadFile(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    const url = `${API_ITEM_URL}/uploadFile`;
    return this.http.post<string>(url, formData);
  }
  importMatHang(items : MatHang[]): Observable<any> {
     const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${API_ITEM_URL}/importItems`;
    return this.http.post<any>(url, items, { headers: httpHeaders });
  }
getById(id: string): Observable<any> {
  const httpHeaders = this.httpUtils.getHTTPHeaders();
  const params = new HttpParams().set('id', id);
  const url = `${API_ITEM_URL}/GetItemById`;
  return this.http.get<any>(url, { headers: httpHeaders, params });
}


    updateMatHang(item: MatHang): Observable<any> {
      const httpHeaders = this.httpUtils.getHTTPHeaders();
      const url = `${API_ITEM_URL}/updateItem`;
      return this.http.post<any>(url, item, { headers: httpHeaders });
    }

  delete(rowId: number): Observable<any> {
    const url = `${API_ITEM_URL}/Item/${rowId}`;
    const headers = this.httpUtils.getHTTPHeaders();
    return this.http.delete<any>(url, { headers });
  }
}
