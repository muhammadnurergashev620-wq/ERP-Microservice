import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

// Mikroservislardan kelgan xatolarni (RpcException) HTTP javobga aylantiradi
@Catch()
export class RpcExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();

    if (exception instanceof HttpException) {
      return res.status(exception.getStatus()).json(exception.getResponse());
    }

    if (exception?.code === 'ECONNREFUSED' || exception?.code === 'ECONNRESET') {
      return res.status(HttpStatus.SERVICE_UNAVAILABLE).json({
        statusCode: 503,
        message: 'Service unavailable',
      });
    }

    const statusCode = Number(exception?.statusCode) || 500;
    res.status(statusCode).json({
      statusCode,
      message: exception?.message ?? 'Internal server error',
    });
  }
}
