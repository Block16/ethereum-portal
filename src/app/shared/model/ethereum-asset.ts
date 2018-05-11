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

  public calculateAmount(value: BigNumber): BigNumber {
    return value.div(this.places());
  }

  /**
   * Raw number of tokens, i.e. - without decimal places
   * @param {number} amount
   * @returns {BigNumber}
   */
  public amountToRaw(amount: string): BigNumber {
    return new BigNumber(amount, 10).times(this.places());
  }

  public symbolAbbreviation(): string {
    return this.symbol.substr(0, 3).toUpperCase();
  }

  public symbolSvg(): string {
    return '/assets/img/icons/coins/' + this.symbol.toLowerCase() + '.svg';
  }
}
