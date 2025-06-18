
// API related types
export interface APIError {
  message: string;
  code?: string;
  details?: any;
}

export interface APISuccess<T> {
  data: T;
  message?: string;
}

export type APIResult<T> = APISuccess<T> | APIError;
