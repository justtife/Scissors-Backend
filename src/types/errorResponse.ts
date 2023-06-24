export default interface ErrorResponse {
  message: string;
  code?: number | 11245; //Error response Code
  statusCode?: number;
  readonly status?: "failed";
  data?: any;
}
