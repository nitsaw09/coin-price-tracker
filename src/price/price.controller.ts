import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PriceService } from './price.service';
import { SetAlertDto } from './dto/set-alert.dto';

@ApiTags('prices')
@Controller('prices')
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Get('hourly')
  @ApiOperation({ summary: 'Get hourly prices for last 24 hours' })
  @ApiResponse({ status: 200, description: 'Returns hourly prices' })
  async getHourlyPrices(@Query('chain') chain: string) {
    return this.priceService.getHourlyPrices(chain);
  }

  @Post('alerts')
  @ApiOperation({ summary: 'Set price alert' })
  @ApiResponse({ status: 201, description: 'Alert has been set' })
  async setAlert(@Body() setAlertDto: SetAlertDto) {
    return this.priceService.setAlert(
      setAlertDto.chain,
      setAlertDto.targetPrice,
      setAlertDto.email
    );
  }

  @Get('swap-rate')
  @ApiOperation({ summary: 'Get ETH to BTC swap rate' })
  @ApiResponse({ status: 200, description: 'Returns swap rate details' })
  async getSwapRate(@Query('ethAmount') ethAmount: number) {
    return this.priceService.getSwapRate(ethAmount);
  }
}