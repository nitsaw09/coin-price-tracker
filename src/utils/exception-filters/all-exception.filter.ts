import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
  
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);
    
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    let res: any = "Internal Server Error";
    let status: number = HttpStatus.INTERNAL_SERVER_ERROR;
    if (exception instanceof HttpException) {
      res = exception?.getResponse();
      status = exception?.getStatus() || 500;
    }
    let message = res;
    if (typeof res === 'object') {
      message = res.message;
      if (Array.isArray(res.message)) {
        message = res.message[0];
      }
    }
  
    const errorResponse = {
      statusCode: status,
      error: true,
      message,
    };
  
    this.logger.error(JSON.stringify(errorResponse));
  
    response.status(status).json(errorResponse);
  }
}
  