import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { Inject, Injectable } from '@angular/core';

import { QueryParamsModel } from 'src/app/_core/models/query-models/query-params.model';
import { environment } from 'src/environments/environment';
import { ResultObjectModel,ResultModel } from 'src/app/_metronic/core/models/_base.model';
// import { CATCH_ERROR_VAR } from '@angular/compiler/src/output/output_ast';
import { catchError, finalize, tap } from 'rxjs/operators';
import { GroupingState, ITableState, PaginatorState, SortState } from 'src/app/_metronic/shared/crud-table';
import { AccountDTO ,AccountModel, AccountStatusModel  } from '../Model/account-management.model';
import { HttpUtilsService } from 'src/app/_core/utils/http-utils.service';
const API_PRODUCTS_URL = environment.ApiRoot + '/accountmanagement';
const DEFAULT_STATE: ITableState = {
  filter: {},
  paginator: new PaginatorState(),
  sorting: new SortState(),
  searchTerm: '',
  grouping: new GroupingState(),
  entityId: undefined,
};

@Injectable({providedIn : 'root'})
export class AccountManagementService {
  // Private fields
  private _items$ = new BehaviorSubject<AccountDTO[]>([]);
  private _isLoading$ = new BehaviorSubject<boolean>(false);
  private _isFirstLoading$ = new BehaviorSubject<boolean>(true);
  private _tableState$ = new BehaviorSubject<ITableState>(DEFAULT_STATE);
  private _errorMessage = new BehaviorSubject<string>('');
  private _subscriptions: Subscription[] = [];
  private _tableAppCodeState$ = new BehaviorSubject<ITableState>(DEFAULT_STATE);
  // Getters
  get items$() {
    return this._items$.asObservable();
  }
  get isLoading$() {
    return this._isLoading$.asObservable();
  }
  get isFirstLoading$() {
    return this._isFirstLoading$.asObservable();
  }
  get errorMessage$() {
    return this._errorMessage.asObservable();
  }
  get subscriptions() {
    return this._subscriptions;
  }
  get tableAppCodeState$() {
    return this._tableAppCodeState$.asObservable();
  }
  // State getters
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

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

 public fetch() {
  this._isLoading$.next(true);
  this._errorMessage.next('');

  const request = this.findData(this._tableState$.value).pipe(
    tap((res: ResultModel<AccountDTO>) => {
      if (res && res.status === 1) {
        this._items$.next(res.data);
        this._tableState$.value.paginator.total = res.panigator.TotalCount;
      } else {
        console.error('Error response:', res);

        // Reset danh sách và total về rỗng
        this._items$.next([]);
        this._tableState$.value.paginator.total = 0;

        this._errorMessage.next(res.error?.message ?? 'Lỗi không xác định');
      }
    }),
    finalize(() => {
      this._isLoading$.next(false);
    })
  ).subscribe();

  this._subscriptions.push(request);
}


  // Base Methods
  public patchState(patch: Partial<ITableState>) {
    this.patchStateWithoutFetch(patch);
    this.fetch();
  }

  public fetchStateSort(patch: Partial<ITableState>) {
    this.patchStateWithoutFetch(patch);
    this.fetch();
  }

  public patchStateWithoutFetch(patch: Partial<ITableState>) {
    const newState = Object.assign(this._tableState$.value, patch);
    this._tableState$.next(newState);
  }

  private findData(tableState: ITableState): Observable<any> {
    this._errorMessage.next('');
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    console.log(tableState);
    const url = API_PRODUCTS_URL + '/Get_DS';
    return this.http.post<any>(url, tableState, {
      headers: httpHeaders,
    }).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        return of({ items: [], total: 0 });
      })
    );
  }
  
  GetUserById(id : number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/Get_User/${id}`;
    return this.http.get<any>(url, { headers: httpHeaders });
  }

  createAccount(item: AccountModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + '/createAccount';
    return this.http.post<any>(url, item, { headers: httpHeaders });
  }

   UpdateUserRoles(userId: string, roles: any[]): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/UpdateUserRoles/${userId}`;
    return this.http.post<any>(url, roles, { headers: httpHeaders });
  }
  updateAccount(item: AccountModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + '/updateAccount';
    return this.http.post<any>(url, item, { headers: httpHeaders });
  }

  UpdateStatusAccount(item: AccountStatusModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + '/UpdateStatusAccount';
    return this.http.post<any>(url, item, { headers: httpHeaders });
  }


  getAccountModelByRowID(RowID: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/GetAccountByRowID?RowID=${RowID}`;
    return this.http.get<any>(url, { headers: httpHeaders });
  }

  getNoteLock(RowID: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/GetNoteLock?RowID=${RowID}`;
    return this.http.get<any>(url, { headers: httpHeaders });
  }

  getPartnerFilters(): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/GetFilterPartner`;
    return this.http.get<any>(url, { headers: httpHeaders });
  }
}
