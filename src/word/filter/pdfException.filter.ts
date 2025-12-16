import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class PDFExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    if (response.headersSent) {
      console.log('stream started');

      if (!response.writableFinished) {
        response.end();
        return;
      }
      return;
    }

    const resStatus =
      exception instanceof HttpException
        ? status
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal Server Error';

    return response.status(resStatus).json({
      statusCode: resStatus,
      message,
      success: false,
    });
  }
}
