import { Injectable } from '@angular/core';
import Web3 from "web3";
declare var web3;

@Injectable()
export class Web3Service {
  public web3js: any;
  public infuraLocation = "https://mainnet.infura.io";

  constructor() {
    if (typeof web3 !== 'undefined') {
      // Use Mist/MetaMask's provider
      this.web3js = new Web3(web3.currentProvider);
      console.log("Using metamask provider");
    } else {
      // Not using metamask
      this.web3js = new Web3(new Web3.providers.HttpProvider(this.infuraLocation));
      console.log("Using infura provider");
    }
  }

  public getTransactions(address: string) {

  }
}
