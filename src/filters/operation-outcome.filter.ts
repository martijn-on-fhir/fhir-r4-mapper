import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class OperationOutcomeFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    const severity = status >= 500 ? 'fatal' : 'error';

    response.status(status).json({
      resourceType: 'OperationOutcome',
      issue: [
        {
          severity,
          code: this.mapStatusToCode(status),
          diagnostics: message,
        },
      ],
    });
  }

  private mapStatusToCode(status: number): string {
    switch (status) {
      case 400:
        return 'invalid';
      case 401:
        return 'login';
      case 403:
        return 'forbidden';
      case 404:
        return 'not-found';
      case 409:
        return 'conflict';
      case 422:
        return 'processing';
      default:
        return 'exception';
    }
  }
}