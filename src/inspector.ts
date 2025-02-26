import { Provider } from '@ethersproject/providers';

import Chain from './chain.js';
import classify from './classifier/index.js';
import fetchPools from './fetch.js';
import { TxMev, BlockMev, getSwaps, getArbitrages } from './mev.js';

class Inspector {
  chainId: number;
  provider: Provider;
  chain: Chain;

  constructor(chainId: number, provider: Provider) {
    this.chainId = chainId;
    this.provider = provider;
    this.chain = new Chain(provider);
  }

  async tx(hash: string): Promise<TxMev[]> {
    const logs = await this.chain.getTransactionLogs(hash);
    const classified = classify(logs);
    const pools = await fetchPools(this.provider, classified);
    const swaps = getSwaps(pools, classified);
    const arbitrages = getArbitrages(swaps);
    return arbitrages;
  }

  async block(number: number): Promise<BlockMev[]> {
    const logs = await this.chain.getBlockLogs(number);
    const classified = classify(logs);
    const pools = await fetchPools(this.provider, classified);
    const swaps = getSwaps(pools, classified);
    const arbitrages = getArbitrages(swaps);
    return arbitrages;
  }
}

export default Inspector;
