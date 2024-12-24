import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
  
export interface Response<T> {
  statusCode?: string;
  success?: boolean;
  paginate?: any;
  data?: T;
  message?: string;
}
  
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>>
{
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map((res) => {
        const response: Response<T> = {};
        
        response.statusCode = context.switchToHttp().getResponse().statusCode || 200;
        response.success = true;
  
        if (res?.paginate) {
          response.paginate = res?.paginate;
        }
  
        response.data = res?.data || [];
        response.message = res?.message || '';
  
        return response;
      }),
    );
  }
}
  