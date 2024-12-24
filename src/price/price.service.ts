import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { Price } from '../database/entities/price.entity';
import { MoralisService } from '../common/moralis/moralis.service';
import { EmailService } from '../common/email/email.service';
import { PriceAlert } from '../database/entities/price-alert.entity';
import { chains, chainTokenAddresses, networks } from '../common/moralis/token-details';
import { Response } from '../utils/inteceptors/transform.interceptor';

@Injectable()
export class PriceService {
  private readonly logger = new Logger(PriceService.name);

  constructor(
    @InjectRepository(Price)
    private priceRepository: Repository<Price>,
    @InjectRepository(PriceAlert)
    private priceAlertRepository: Repository<PriceAlert>,
    private readonly moralisService: MoralisService,
    private readonly emailService: EmailService,
  ) {}

  async getHourlyPrices(chain: string): Promise<Response<any>> {
    const response: Response<any> = {};
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const hourlyPrices = await this.priceRepository
      .createQueryBuilder('price')
      .select('DATE_TRUNC(\'hour\', price.timestamp)', 'hour') 
      .addSelect('AVG(price.price)', 'averagePrice') 
      .where('price.chain = :chain', { chain }) 
      .andWhere('price.timestamp >= :timestamp', { timestamp: twentyFourHoursAgo }) 
      .groupBy('hour')
      .orderBy('hour', 'DESC') 
      .getRawMany(); 

    this.logger.log(`Hourly prices of ${chain}`);
    
    // Map the results to the desired format
    response.data = hourlyPrices.map(item => ({
        timestamp: item.hour, // The hour timestamp
        price: parseFloat(item.averagePrice), // The average price as a float
    }));

    return response;
}

  async setAlert(chain: string, targetPrice: number, email: string): Promise<void> {
    await this.priceAlertRepository.save({
      chain,
      targetPrice,
      email,
      isTriggered: false,
    });
  }

  async getSwapRate(ethAmount: number): Promise<Response<any>> {
    const response: Response<any> = {};    
    
    const { ETHEREUM, BITCOIN } = networks;
    const wETH = chainTokenAddresses[ETHEREUM];
    const wBTC = chainTokenAddresses[BITCOIN];
    const chainId = chains[ETHEREUM];
    const ethPrice = await this.moralisService.getPrice(wETH, chainId);
    const btcPrice = await this.moralisService.getPrice(wBTC, chainId);

    const ethValue = ethAmount * ethPrice;
    const btcAmount = ethValue / btcPrice;

    const feePercentage = 0.0003; // 0.03%
    const feeEth = ethAmount * feePercentage;
    const feeUsd = feeEth * ethPrice;

    response.data = {
      btcAmount: btcAmount * (1 - feePercentage),
      feeEth,
      feeUsd,
    };
    this.logger.log(`Swap Rate for ETH amount to BTC: ${response?.data?.btcAmount}`);
    return response;
  }

  @Cron('*/5 * * * *')
  async trackPrices(): Promise<void> {
    for (const chain in chains) {
      const tokenAddress = chainTokenAddresses[chain];
      const chainId = chains[chain];
      const price = await this.moralisService.getPrice(tokenAddress, chainId);
      this.logger.log(`${chain} price: ${price}`);
      await this.savePriceAndCheckAlert(chain, price);
    }
  }

  private async savePriceAndCheckAlert(chain: string, currentPrice: number): Promise<void> {
    // Save current price
    await this.priceRepository.save({ chain, price: currentPrice });

    // Get price from 1 hour ago
    const hourAgoPrice = await this.priceRepository.findOne({
      where: {
        chain,
        timestamp: LessThan(new Date(Date.now() - 3600000))
      },
      order: { timestamp: 'DESC' }
    });

    if (hourAgoPrice) {
      const priceIncrease = ((currentPrice - hourAgoPrice.price) / hourAgoPrice.price) * 100;
      if (priceIncrease > 3) {
        this.emailService.sendMail({
          to: 'hyperhire_assignment@hyperhire.in',
          subject: 'Blockchain Price Alert',
          message: `${chain} price increased by ${priceIncrease.toFixed(2)}% in the last hour`
        });
      }
    }
  }
}