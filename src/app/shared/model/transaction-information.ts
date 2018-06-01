import {BigNumber} from "bignumber.js";

export class TransactionInformation {

  public created: Date;
  public amount: BigNumber;

  constructor(
    public toAddress: string,
    public fromAddress: string,
    public status: string,
    public blockNumber: number,
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

  static fromJsonRep(jsonRep: any): TransactionInformation {
    return new TransactionInformation(
      jsonRep.toAddress,
      jsonRep.fromAddress,
      jsonRep.status,
      jsonRep.blockNumber,
      jsonRep.kind,
      jsonRep.assetName,
      jsonRep.amount,
      jsonRep.created,
      jsonRep.hash
    );
  }

  toJsonRep(): any {
    return {
      'toAddress': this.toAddress,
      'fromAddress': this.fromAddress,
      'status': this.status,
      'blockNumber': this.blockNumber,
      'kind': this.kind,
      'assetName': this.assetName,
      'amount': this.amount.toString(),
      'created': this.created.getTime(),
      'hash': this.hash
    };
  }

  getClockTime(): string {
    const hh = this.created.getHours();
    const m = this.created.getMinutes();
    let h = hh;
    if (h >= 12) {
      h = hh - 12;
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

  greaterThanHour(): boolean {
    const diff = (new Date().getTime() - this.created.getTime()) / (1000 * 60 * 60);
    const hrs = Math.abs(Math.floor(diff));
    return hrs > 0;
  }
}
