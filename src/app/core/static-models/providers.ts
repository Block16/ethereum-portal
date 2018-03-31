
export class Provider {
  constructor(readonly name: string, readonly location: string) {

  }
}

const Providers = [
  new Provider("Infura", "https://mainnet.infura.io"),
];

export { Providers };
