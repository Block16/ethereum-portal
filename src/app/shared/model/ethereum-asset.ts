import {BigNumber} from 'bignumber.js';
import {isNullOrUndefined} from "util";

export class EthereumAsset {
  constructor (
    readonly name: string,
    readonly symbol: string,
    public amount: BigNumber,
    readonly decimalPlaces: number,
    readonly contractAddress: string,
    readonly gasLimit?: number,
    readonly hasSymbol?: boolean) {
    // Token txs are usually 30000 - 60000 gas
    if (isNullOrUndefined(gasLimit)) {
      this.gasLimit = 65000;
    }

    if (isNullOrUndefined(hasSymbol)) {
      this.hasSymbol = false;
    } else {
      this.hasSymbol = hasSymbol;
    }
  }

  /**
   * Raw number of tokens
   * Used to convert from "normal", i.e. - 1.2 ETH,  form to amount without decimals
   * @param {number} amount
   * @returns {BigNumber}
   */
  public amountToRaw(amount: string | BigNumber): BigNumber {
    if (typeof amount === "string") {
      return new BigNumber(amount, 10).times(this.places());
    } else {
      return amount.times(this.places());
    }
  }

  /**
   * Helper function to get the calculated number of decimal places
   * @returns {BigNumber}
   */
  public places(): BigNumber {
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
   * Convert from raw to normal form, 1 * 10^18 ETH -> 1.0 ETH
   * @param {BigNumber} value
   * @returns {BigNumber}
   */
  public calculateAmount(value: BigNumber): BigNumber {
    return value.div(this.places());
  }

  public symbolAbbreviation(): string {
    return this.symbol.substr(0, 3).toUpperCase();
  }

  public hasBalance(): boolean {
    return this.calculatedAmount.gt(0);
  }
}
