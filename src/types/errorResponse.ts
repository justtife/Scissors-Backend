export default interface ErrorResponse {
  message: string;
  code?: number | 54321; //Error response Code
  statusCode?: number;
  readonly status?: "failed";
  data?: any;
}
