export default class CustomError extends Error {
  protected constructor(
    message: string,
    public statusCode: number,
    public errorCode: number
  ) {
    super(message);
    this.errorCode = this.statusCode = statusCode;
  }
}
