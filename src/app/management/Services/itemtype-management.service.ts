import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, catchError, finalize, map, Observable, of, tap } from "rxjs";
import { HttpUtilsService } from "src/app/_core/utils/http-utils.service";
import { environment } from "src/environments/environment";
import { LoaiMatHangModel } from "../Model/Inventory-management.model";
import { ResultModel } from "src/app/_metronic/core/models/_base.model";
import { GroupingState, ITableState, PaginatorState, SortState } from "src/app/_metronic/shared/crud-table";
import { FormGroup } from "@angular/forms";

const API_ITEMTYPE_URL = `${environment.ApiRoot}/InventoryManagement`;
const DEFAULT_STATE: ITableState = {
  filter: {},
  paginator: new PaginatorState(),
  sorting: new SortState(),
  searchTerm: '',
  grouping: new GroupingState(),
  entityId: undefined,
};
@Injectable({providedIn : 'root'})

export class LoaiMatHangService{
    private http = inject(HttpClient);
    private httpUtils = inject(HttpUtilsService);

    public Visible: boolean = true;
    public HasPermission: boolean;
    private _item$ = new BehaviorSubject<LoaiMatHangModel[]>([]);
    private _isLoading$ = new BehaviorSubject<boolean>(false);
      private _isFirstLoading$ = new BehaviorSubject<boolean>(true);
       private _errorMessage = new BehaviorSubject<string>('');
    private _tableState$ = new BehaviorSubject<ITableState>({ ...DEFAULT_STATE });
    private _tableAppCodeState$ = new BehaviorSubject<ITableState>({ ...DEFAULT_STATE });


   /** ---------- Getters (public observables) ---------- */

   readonly item$ = this._item$ .asObservable();
   readonly isLoading$ = this._isLoading$.asObservable();
  readonly isFirstLoading$ = this._isFirstLoading$.asObservable();
  readonly errorMessage$ = this._errorMessage.asObservable();
  readonly tableAppCodeState$ = this._tableAppCodeState$.asObservable();

   /** ---------- State accessors ---------- */
     get paginator() {
    return this._tableState$.value.paginator;
  }
  get paginatorAppList() {
    return this._tableAppCodeState$.value.paginator;
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

  /** ---------- State patching --------/-- */
  patchState(patch : Partial<ITableState>):void {
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

  /**
     * Fetch data for route guard - trả về Promise để có thể await
     */
    fetchForGuard(): Promise<void> {
      return new Promise((resolve, reject) => {
        this._isLoading$.next(true);
        this._errorMessage.next('');
        
        this.findData(this._tableState$.value)
          .pipe(
            tap((res: ResultModel<LoaiMatHangModel>) => {
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

    /** ---------- Fetch data ---------- */

    fetch() : void{
      this._isLoading$.next(true);
      this._errorMessage.next("");

      this.findData(this._tableState$.value).pipe(
        tap((res : ResultModel<LoaiMatHangModel>)=>{
          if(res && res.status ===1 ){
            this.Visible = res.Visible;
            this.HasPermission = res.HasPermission;
            this._item$.next(res.data);
           this._tableState$.value.paginator.recalculatePaginator(res.panigator.TotalCount);
          this._tableState$.next({
            ...this._tableState$.value
          });

          }
          else{
            this._item$.next([]);
            this._tableState$.value.paginator.recalculatePaginator(0);
            this._tableState$.next({
              ...this._tableState$.value
            });

             this._errorMessage.next(res.error?.message ?? 'Lỗi không xác định');
          }
                    console.log('Fetch data completed:', res);

        }),
        catchError((err)=>{
          this._errorMessage.next('Lỗi kết nối');
          this._item$.next([]);
          return of();
        }),
        finalize(() => this._isLoading$.next(false))
      ).subscribe();
    }
 getLoaiChaList(): Observable<LoaiMatHangModel[]> {
  const state: ITableState = {
    ...DEFAULT_STATE,
    filter: {}
  };

  return this.findData(state).pipe(
    map((res: ResultModel<LoaiMatHangModel>) => {
      console.log(res?.data)
      return res?.data?.filter(item => item.IdLMHParent === 0) || []}

    ),
    catchError(() => of([]))
  );
}

generateNewMaLMH(): Observable<string> {
  const paginator = new PaginatorState();
  paginator.page = 1;
  paginator.pageSize = 1000;

  const state: ITableState = {
    ...DEFAULT_STATE,
    paginator
  };

  return this.findData(state).pipe(
    map((res: ResultModel<LoaiMatHangModel>) => {
      const maList = res?.data
        ?.map((x: any) => x.MaLMH)
        .filter((ma: string) => /^LMH\d{3}$/.test(ma));

      const maxNumber = maList?.length
        ? Math.max(...maList.map((ma: string) => parseInt(ma.replace('LMH', ''), 10)))
        : 0;

      return 'LMH' + (maxNumber + 1).toString().padStart(3, '0');
    })
  );
}



    /** ---------- API Methods ---------- */
    private findData(state : ITableState) : Observable<any>{
       const headers = this.httpUtils.getHTTPHeaders();
      const url = `${API_ITEMTYPE_URL}/GetAll`;
      return this.http.post<any>(url, state, { headers });
    } 

      createLoaiMatHang(item: LoaiMatHangModel): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = API_ITEMTYPE_URL + '/addItemType';
        return this.http.post<any>(url, item, { headers: httpHeaders });
      }

      updateLoaiMatHang(item: LoaiMatHangModel): Observable<any> {
      const httpHeaders = this.httpUtils.getHTTPHeaders();
      const url = API_ITEMTYPE_URL + '/updateItemType'; 
      return this.http.post<any>(url, item, { headers: httpHeaders });
    }
    delete(rowId: number): Observable<any> {
      const url = `${API_ITEMTYPE_URL}/${rowId}`; // API DELETE theo id
      const headers = this.httpUtils.getHTTPHeaders();

      return this.http.delete<any>(url, { headers });
    }

}