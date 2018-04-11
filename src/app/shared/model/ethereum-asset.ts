import {BigNumber} from 'bignumber.js';
import {isNullOrUndefined} from "util";

export class EthereumAsset {
  constructor (
    readonly name: string,
    readonly symbol: string,
    public amount: BigNumber,
    readonly decimalPlaces: number,
    readonly gasLimit?: number,
    readonly contractAddress?: string) {
    // Token txs are usually 30000 - 60000 gas
    if (isNullOrUndefined(gasLimit)) {
      this.gasLimit = 65000;
    }
  }

  /**
   * Helper function to get the calculated number of decimal places
   * @returns {BigNumber}
   */
  private places(): BigNumber {
    return new BigNumber(10).pow(this.decimalPlaces);
  }

  /**
   * Get calculated amount of tokens with regard to decimal places
   * @returns {BigNumber}
   */
  get calculatedAmount(): BigNumber {
    return this.amount.div(this.places());
  }

  /**
   * Raw number of tokens, i.e. - without decimal places
   * @param {number} amount
   * @returns {BigNumber}
   */
  public amountToRaw(amount: number): BigNumber {
    return new BigNumber(amount, 10).times(this.places());
  }
}
