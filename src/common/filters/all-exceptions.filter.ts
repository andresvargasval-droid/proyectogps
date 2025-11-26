// src/common/filters/all-exceptions.filter.ts
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Ocurrió un error interno en el servidor';
    let errors: any = null;

    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      const response = exception.getResponse();

      if (typeof response === 'string') {
        message = response;
      } else if (typeof response === 'object' && response !== null) {
        const r: any = response;
        message = r.message || message;
        // Por ejemplo, errores de validación de class-validator
        if (r.message && Array.isArray(r.message)) {
          errors = r.message;
          message = 'Hay errores de validación en los datos enviados';
        }
      }
    }

    const request = ctx.getRequest();
    const responseBody = {
      success: false,
      message,
      statusCode: httpStatus,
      errors,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(request),
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
