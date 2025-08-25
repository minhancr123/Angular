import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, catchError, finalize, map, Observable, of, tap } from "rxjs";
import { HttpUtilsService } from "src/app/_core/utils/http-utils.service";
import { environment } from "src/environments/environment";
import { ResultModel } from "src/app/_metronic/core/models/_base.model";
import { GroupingState, ITableState, PaginatorState, SortState } from "src/app/_metronic/shared/crud-table";
import { NhanHieuModel } from "../Model/Inventory-management.model";

const API_NHANHIEU_URL = `${environment.ApiRoot}/InventoryManagement`;
const DEFAULT_STATE: ITableState = {
  filter: {},
  paginator: new PaginatorState(),
  sorting: new SortState(),
  searchTerm: '',
  grouping: new GroupingState(),
  entityId: undefined
};

@Injectable({ providedIn: 'root' })
export class NhanHieuService {
  private http = inject(HttpClient);
  private httpUtils = inject(HttpUtilsService);

  public Visible: boolean;
  public HasPermission: boolean;
  private _items$ = new BehaviorSubject<NhanHieuModel[]>([]);
  private _isLoading$ = new BehaviorSubject<boolean>(false);
  private _isFirstLoading$ = new BehaviorSubject<boolean>(true);
  private _errorMessage = new BehaviorSubject<string>('');
  private _tableState$ = new BehaviorSubject<ITableState>({ ...DEFAULT_STATE });

  // Public Observables
  readonly items$ = this._items$.asObservable();
  readonly isLoading$ = this._isLoading$.asObservable();
  readonly isFirstLoading$ = this._isFirstLoading$.asObservable();
  readonly errorMessage$ = this._errorMessage.asObservable();
  readonly tableState$ = this._tableState$.asObservable();

  // State Accessors
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

  // State Patching
  patchState(patch: Partial<ITableState>): void {
    this.patchStateWithoutFetch(patch);
    this.fetch();
  }

  patchStateWithoutFetch(patch: Partial<ITableState>): void {
    const newState = { ...this._tableState$.value, ...patch };
    this._tableState$.next(newState);
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
          tap((res: ResultModel<NhanHieuModel>) => {
            if (res && res.status === 1) {
              this.Visible = res.Visible;
              this.HasPermission = res.HasPermission;
              console.log("BrandService fetchForGuard - Visible:", this.Visible, "HasPermission:", this.HasPermission);
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
  // Data Fetching
  fetch(): void {
    this._isLoading$.next(true);
    this._errorMessage.next("");

    this.findData(this._tableState$.value).pipe(
      tap((res: ResultModel<NhanHieuModel>) => {
        if (res && res.status === 1) {
          this.Visible = res.Visible;
          this.HasPermission = res.HasPermission;
          this._items$.next(res.data);
          this._tableState$.value.paginator.recalculatePaginator(res.panigator.TotalCount);
          this._tableState$.next({
            ...this._tableState$.value
          });
        } else {
          this._items$.next([]);
          this._tableState$.value.paginator.recalculatePaginator(0);
          this._tableState$.next({
            ...this._tableState$.value
          });
          this._errorMessage.next(res.error?.message ?? 'Lỗi không xác định');
        }
      }),
      catchError((err) => {
        this._errorMessage.next('Lỗi kết nối');
        this._items$.next([]);
        return of();
      }),
      finalize(() => this._isLoading$.next(false))
    ).subscribe();
  }

  // API Methods
  getAll(): Observable<NhanHieuModel[]> {
    const state: ITableState = {
      ...DEFAULT_STATE,
      filter: {}
    };

    return this.findData(state).pipe(
      map((res: ResultModel<NhanHieuModel>) => res?.data || []),
      catchError(() => of([]))
    );
  }

  private findData(state: ITableState): Observable<any> {
    const headers = this.httpUtils.getHTTPHeaders();
    const url = `${API_NHANHIEU_URL}/GetAllBrand`;
    return this.http.post<any>(url, state, { headers });
  }

  create(nhanHieu: NhanHieuModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${API_NHANHIEU_URL}/addBrand`;
    return this.http.post<any>(url, nhanHieu, { headers: httpHeaders });
  }

  update(nhanHieu: NhanHieuModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${API_NHANHIEU_URL}/updateBrand`;
    return this.http.post<any>(url, nhanHieu, { headers: httpHeaders });
  }

  delete(id: number): Observable<any> {
    const url = `${API_NHANHIEU_URL}/Brand/${id}`;
    const headers = this.httpUtils.getHTTPHeaders();
    return this.http.delete<any>(url, { headers });
  }
}