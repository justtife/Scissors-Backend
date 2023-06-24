import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ResponseHandlerService {
  constructor() {}

  handleSuccessMessage(response: any, customMessage?: string): object {
    if (customMessage) {
      return { customMessage, color: 'alert-success' };
    } else if (response && response.message) {
      return { customMessage: response.message, color: 'alert-success' };
    } else {
      return {
        customMessage: 'Operation completed successfully',
        color: 'alert-success',
      };
    }
  }

  handleErrorMessage(
    customMessage: string,
    error?: HttpErrorResponse
  ): Observable<object> {
    const errorMessage =
      customMessage ||
      error!.error.message ||
      'An error occurred, please try again later';

    const errorObject = {
      message: errorMessage,
      color: 'alert-danger',
    };

    return of(errorObject);
  }
}
