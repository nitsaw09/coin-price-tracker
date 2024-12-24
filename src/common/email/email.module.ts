import { DynamicModule, Module } from '@nestjs/common';
import { EmailService } from './email.service';

export interface EmailModuleOptions {
  host: string;
  port: number;
  user: string;
  password: string;
}

@Module({})
export class EmailModule {
  static forRoot(options: EmailModuleOptions): DynamicModule {
    return {
      module: EmailModule,
      providers: [
        {
          provide: 'EMAIL_CONFIG',
          useValue: options,
        },
        EmailService,
      ],
      exports: [EmailService],
      global: true,
    };
  }

  static forRootAsync(options: {
    useFactory: (...args: any[]) => Promise<EmailModuleOptions> | EmailModuleOptions;
    inject?: any[];
  }): DynamicModule {
    return {
      module: EmailModule,
      providers: [
        {
          provide: 'EMAIL_CONFIG',
          useFactory: options.useFactory,
          inject: options.inject,
        },
        EmailService,
      ],
      exports: [EmailService],
      global: true,
    };
  }
}