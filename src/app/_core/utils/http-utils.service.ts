// src/app/_core/utils/http-utils.service.ts

import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { ITableState } from 'src/app/_metronic/shared/crud-table';

@Injectable({
  providedIn: 'root',
})
export class HttpUtilsService {
  /**
   * Trả về headers chung cho các request
   */
  getHTTPHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken'); // Bạn có thể sửa để lấy từ TokenStorage hoặc service

    return new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`, // nếu dùng Bearer Token
    });
  }

  /**
   * Dùng khi bạn muốn convert một object JS thành HttpParams cho query string
   */
getFindHTTPParams(tableState: ITableState): HttpParams {
  let params = new HttpParams();

  // Paging
  if (tableState.paginator) {
    params = params.set('page', tableState.paginator.page.toString());
    params = params.set('record', tableState.paginator.pageSize.toString());
  }

  // Sorting
  if (tableState.sorting?.column) {
    params = params.set('sortField', tableState.sorting.column);
    params = params.set('sortOrder', tableState.sorting.direction || 'asc');
  }

  // Add searchTerm to filter as keyword
  if (tableState.searchTerm !== undefined) {
  tableState.filter = {
    ...tableState.filter,
    keyword: tableState.searchTerm
  };
}


  // Filtering
  if (tableState.filter) {
    const keysVals = Object.entries(tableState.filter)
      .filter(([_, value]) => value !== null && value !== '')
      .reduce(
        (acc, [key, value]) => {
          acc.keys.push(key);
          acc.vals.push(Array.isArray(value) ? value.join(',') : value);
          return acc;
        },
        { keys: [], vals: [] } as { keys: string[]; vals: string[] }
      );

    if (keysVals.keys.length > 0) {
      params = params.set('filter.keys', keysVals.keys.join('|'));
      params = params.set('filter.vals', keysVals.vals.join('|'));
    }
  }

  return params;
}






  /**
   * Một dạng payload đặc biệt nếu bạn dùng POST và cần headers riêng
   */
  getHTTPHeadersForUpload(): HttpHeaders {
    return new HttpHeaders({
      // không có Content-Type để browser tự set boundary (cho FormData)
    });
  }
}
