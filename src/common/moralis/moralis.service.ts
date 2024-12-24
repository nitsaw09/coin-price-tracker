import { Inject, Injectable } from '@nestjs/common';
import Moralis from 'moralis';
import { MoralisModuleOptions } from './moralis.module';

@Injectable()
export class MoralisService {
  constructor(
    @Inject('MORALIS_CONFIG')
    private readonly moralisConfig: MoralisModuleOptions,
  ) {
    Moralis.start({
      apiKey: this.moralisConfig.apiKey,
    });
  }

  async getPrice(tokenAddress: string, chainId: string): Promise<number> {
    const response = await Moralis.EvmApi.token.getTokenPrice({
      address: tokenAddress,
      chain: chainId
    });
    return response.raw.usdPrice;
  }
}