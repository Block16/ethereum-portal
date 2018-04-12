export class EthereumAsset {
  constructor (readonly name: string, 
  						 public amount: number,
  						 readonly decimalPlaces: number,
  						 readonly address: string) {

  }

  get calculatedAmount(): number {
    // TODO: This needs to be a BN
    return this.amount / (Math.pow(10, this.decimalPlaces));
  }
}
