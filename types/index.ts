export interface PagedResult<T> {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  items: T[];
}

export interface ItemResult<T> {
  success: string;
  message: string;
  errors: string | null;
  data: T;
}
