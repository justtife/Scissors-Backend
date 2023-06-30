export default interface SuccessResponse {
  message: string;
  readonly code?: 12345;
  data?: object | string | string[];
  token?: string;
  statusCode?: number;
  readonly status?: "success";
}
