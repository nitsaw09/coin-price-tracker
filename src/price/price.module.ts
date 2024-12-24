import { Module } from '@nestjs/common';
import { PriceService } from './price.service';
import { PriceController } from './price.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Price } from '../database/entities/price.entity';
import { PriceAlert } from '../database/entities/price-alert.entity';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forFeature([Price, PriceAlert]),
    ScheduleModule.forRoot()
  ],
  controllers: [PriceController],
  providers: [PriceService],
})
export class PriceModule {}
