import {BigNumber} from "bignumber.js";

export class TransactionInformation {

  public created: Date;
  private amount: BigNumber;

  constructor(
    readonly toAddress: string,
    readonly fromAddress: string,
    readonly status: string,
    readonly blockNumber: number,
    readonly kind: string,
    readonly assetName: string,
    amount: string | BigNumber,
    created: number,
    readonly hash: string
    ) {
    this.created = new Date(created);

    if (typeof amount === "string") {
      this.amount = new BigNumber(amount);
    } else {
      this.amount = amount;
    }
  }

  confirmations(currentBlock: number): number {
    return (currentBlock - this.blockNumber);
  }

  getClockTime(): string {
    const hh = this.created.getHours();
    const m = this.created.getMinutes();
    let dd = "AM";
    let h = hh;

    if (h >= 12) {
      h = hh - 12;
      dd = "PM";
    }

    if (h === 0) {
      h = 12;
    }

    const min = m < 10 ? "0" + m : m;

    return h + ":" + min;
  }

  getAmOrPm() {
    const hh = this.created.getHours();
    let dd = "AM";

    if (hh >= 12) {
      dd = "PM";
    }

    return dd;
  }
}
