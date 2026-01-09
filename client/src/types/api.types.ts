export interface ApiResponse<T = any> {
  result: T;
  statusCode: number;
  status: string;
}
