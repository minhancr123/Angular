 import { Injectable, signal, computed, inject, effect, Inject, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpUtilsService } from 'src/app/_core/utils/http-utils.service';
import {
  AppListDTO,
  CustomerAppAddNumberStaffModel,
  CustomerAppDTO,
  CustomerModel,
  CustomerModelDTO,
  Pakage,
} from '../Model/customer-management.model';
import { ITableService } from 'src/app/_metronic/core/services/itable.service';
import { ResultModel } from 'src/app/_core/models/_base.model';
import { PaginatorState } from 'src/app/shared/models/paginator.model';
import { SortState } from 'src/app/shared/models/sort.model';
import { GroupingState } from 'src/app/shared/models/grouping.model';
import { ITableState } from 'src/app/shared/models/table.model';

const API_PRODUCTS_URL = environment.ApiRoot + '/customermanagement';
const DEFAULT_STATE: ITableState = {
  filter: {},
  paginator: new PaginatorState(),
  sorting: new SortState(),
  searchTerm: '',
  grouping: new GroupingState(),
  entityId: undefined,
};

@Injectable({
  providedIn: 'root'
})
export class CustomerManagementService extends ITableService<CustomerModelDTO[]> implements OnDestroy {
  API_URL_FIND: string = API_PRODUCTS_URL + '/Get_DSCustomer';
  API_URL_CTEATE: string = API_PRODUCTS_URL + '/Get_DSCustomer';
  API_URL_EDIT: string = API_PRODUCTS_URL + '/Get_DSCustomer';
  API_URL_DELETE: string = API_PRODUCTS_URL + '/Get_DSCustomer';

  constructor(@Inject(HttpClient) http, @Inject(HttpUtilsService) httpUtils) {
    super(http, httpUtils);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  public getListApp(): Observable<ResultModel<AppListDTO[]>> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/GetListApp`;
    return this.http.get<ResultModel<AppListDTO[]>>(url, {
      headers: httpHeaders,
    });
  }

  public getPakageList(): Observable<Pakage[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/GetPakageListApp`;
    return this.http.get<Pakage[]>(url, {
      headers: httpHeaders,
    });
  }

public getListAppFromJeeAccount(CustomerID: number): Observable<ResultModel<CustomerAppDTO[]>> {
  const httpHeaders = this.httpUtils.getHTTPHeaders();
  const url = API_PRODUCTS_URL + `/GetListAppFromJeeAccount?CustomerID=${CustomerID}`;
  return this.http.get<ResultModel<CustomerAppDTO[]>>(url, {
    headers: httpHeaders,
  });
}

  createCustomer(item: CustomerModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + '/CreateCustomer';
    return this.http.post<any>(url, item, { headers: httpHeaders });
  }

  importCustomer(item: CustomerModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + '/ImportCustomer';
    return this.http.post<any>(url, item, { headers: httpHeaders });
  }

  updateCustomerAppAddNumberStaff(item: CustomerAppAddNumberStaffModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + '/UpdateCustomerAppAddNumberStaff';
    return this.http.post<any>(url, item, { headers: httpHeaders });
  }

  getDateFilterCustomer(): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/DateFilter`;
    return this.http.get<any>(url, {
      headers: httpHeaders,
    });
  }
}