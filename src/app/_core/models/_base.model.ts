// src/app/_core/models/_base.model.ts (or similar)
export interface ResultModel<T> {
  status: number;
  data: T;
  error?: { message: string };
}