import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomHttpException extends HttpException {
  constructor(data: any, status: HttpStatus, message?: string) {
    super(data, status);
    this.message = message || 'Something went wrong';
  }
}
