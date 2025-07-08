import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpUtilsService } from '../../../_core/utils/http-utils.service';
import { GroupingState, ITableState, PaginatorState, SortState } from 'src/app/_metronic/shared/crud-table';
import { ResultModel } from '../../../_core/models/_base.model';
import { LoModel } from '../Model/customer-management.model';

const API_PRODUCTS_URL = environment.ApiRoot + '/customermanagement'; 
const DEFAULT_STATE: ITableState = {
  filter: {},
  paginator: new PaginatorState(),
  sorting: new SortState(),
  searchTerm: '',
  grouping: new GroupingState(),
  entityId: undefined,
};

// Define the actual API response structure
interface ApiResponse {
  status: number;
  data: {
    data: LoModel[];
    panigator: {
      TotalCount: number;
    };
  };
  error?: {
    message: string;
  };
}

@Injectable()
export class LoListService {
  private _items$ = new BehaviorSubject<LoModel[]>([]);
  private _isLoading$ = new BehaviorSubject<boolean>(false);
  private _isFirstLoading$ = new BehaviorSubject<boolean>(true);
  private _tableState$ = new BehaviorSubject<ITableState>({ ...DEFAULT_STATE });
  private _errorMessage = new BehaviorSubject<string>('');
  private _subscriptions: Subscription[] = [];

  // Getters
  get items$(): Observable<LoModel[]> {
    return this._items$.asObservable();
  }
  get isLoading$(): Observable<boolean> {
    return this._isLoading$.asObservable();
  }
  get paginator(): PaginatorState {
    return this._tableState$.value.paginator;
  }
  get sorting(): SortState {
    return this._tableState$.value.sorting;
  }
  get grouping(): GroupingState {
    return this._tableState$.value.grouping;
  }
  get subscriptions(): Subscription[] {
    return this._subscriptions;
  }
  get errorMessage$(): Observable<string> {
    return this._errorMessage.asObservable();
  }

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) {}

  // Fetch danh sách Lô dựa trên state hiện tại
  public fetch(): void {
    this._isLoading$.next(true);
    this._errorMessage.next('');

    const request = this.find().pipe(
      tap((res: ApiResponse) => {
        console.log('🔍 [DEBUG] Processing API response:', res);
        
        if (res && res.status === 1) {
          // Fix: Extract the actual array from the nested structure
          const actualData = res.data?.data || [];
          const totalCount = res.data?.panigator?.TotalCount || 0;
          
          console.log('📊 [DEBUG] Extracted data array:', actualData);
          console.log('📊 [DEBUG] Total count:', totalCount);
          
          this._items$.next(actualData);
          this._tableState$.value.paginator.total = totalCount;
        } else {
          this._items$.next([]);
          this._errorMessage.next(res.error?.message || 'Không thể tải dữ liệu');
        }
      }),
      finalize(() => this._isLoading$.next(false))
    ).subscribe();

    this._subscriptions.push(request);
  }

  // Patch lại state và fetch mới
  public patchState(patch: Partial<ITableState>): void {
    const newState = Object.assign(this._tableState$.value, patch);
    this._tableState$.next(newState);
    this.fetch();
  }

  // Chỉ patch state, không fetch ngay (nếu cần)
  public patchStateWithoutFetch(patch: Partial<ITableState>): void {
    const newState = Object.assign(this._tableState$.value, patch);
    this._tableState$.next(newState);
  }

  // Gọi API để lấy danh sách Lô, gửi kèm state (paginator, sorting) để server biết phân trang
  private find(): Observable<ApiResponse> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const state = this._tableState$.value;

    const page = state.paginator.page || 1;
    const pageSize = state.paginator.pageSize || 10;
    const sortColumn = state.sorting.column || '';
    const sortDirection = state.sorting.direction || '';
    const searchTerm = state.searchTerm || '';

    const queryParams = [
      `page=${page}`,
      `pageSize=${pageSize}`,
      `sortColumn=${encodeURIComponent(sortColumn)}`,
      `sortDirection=${sortDirection}`,
      `search=${encodeURIComponent(searchTerm)}`
    ].join('&');

    const url = `${API_PRODUCTS_URL}/GetLoList?${queryParams}`;

    console.log('📡 [DEBUG] Gửi request GET:', url);
    console.log('🛠️  [DEBUG] HTTP headers:', httpHeaders);

    return this.http.get<ApiResponse>(url, { headers: httpHeaders })
      .pipe(
        tap((response) => {
          console.log('✅ [DEBUG] Response thành công từ API:', response);
        }),
        catchError((err) => {
          console.error('❌ [DEBUG] Lỗi khi gọi API:', err);
          this._errorMessage.next(err?.error?.message || 'Lỗi khi lấy dữ liệu');
          return of({ 
            status: 0, 
            data: { 
              data: [], 
              panigator: { TotalCount: 0 } 
            } 
          } as ApiResponse);
        })
      );
  }
}