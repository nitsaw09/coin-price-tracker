import { DynamicModule, Module } from '@nestjs/common';
import { MoralisService } from './moralis.service';

export interface MoralisModuleOptions {
  apiKey: string;
  apiVersion?: string;
  chainConfigs?: {
    [key: string]: {
      tokenAddress: string;
    };
  };
}

@Module({})
export class MoralisModule {
  static forRoot(options: MoralisModuleOptions): DynamicModule {
    return {
      module: MoralisModule,
      providers: [
        {
          provide: 'MORALIS_CONFIG',
          useValue: options,
        },
        MoralisService,
      ],
      exports: [MoralisService],
      global: true,
    };
  }

  static forRootAsync(options: {
    useFactory: (...args: any[]) => Promise<MoralisModuleOptions> | MoralisModuleOptions;
    inject?: any[];
  }): DynamicModule {
    return {
      module: MoralisModule,
      providers: [
        {
          provide: 'MORALIS_CONFIG',
          useFactory: options.useFactory,
          inject: options.inject,
        },
        MoralisService,
      ],
      exports: [MoralisService],
      global: true,
    };
  }
}