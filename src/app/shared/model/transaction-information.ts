
import {EthereumAsset} from "./ethereum-asset";

export class TransactionInformation {

  public created: Date;
  private currentBlock: number;
  private amount: BigNumber;

  constructor(
    readonly toAddress: string,
    readonly fromAddress: string,
    readonly status: string,
    readonly blockNumber: number,
    readonly kind: string,
    readonly asset: EthereumAsset,
    amount: string,
    created: string
    )
  {
    this.created = new Date(created);
    // TODO: Will need to be from BigNumber
    this.amount = new BigNumber(amount);
  }

  confirmations(currentBlock: number): number {
    return (currentBlock - this.blockNumber);
  }
}
