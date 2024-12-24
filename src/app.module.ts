import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailModule } from './common/email/email.module';
import { MoralisModule } from './common/moralis/moralis.module';
import { PriceModule } from './price/price.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './utils/inteceptors/transform.interceptor';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EmailModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        host: configService.get('SMTP_HOST'),
        port: configService.get('SMTP_PORT'),
        user: configService.get('SMTP_USER'),
        password: configService.get('SMTP_PASS'),
      }),
    }),
    MoralisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        apiKey: configService.get('MORALIS_API_KEY')
      }),
    }),
    DatabaseModule,
    PriceModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    }
  ],
})
export class AppModule {}