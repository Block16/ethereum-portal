import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {EthereumAsset} from "../shared/model/ethereum-asset";
import {HttpClient} from "@angular/common/http";
import {BigNumber} from "bignumber.js";
import {Observable} from "rxjs/Observable";
import {CoreKeyManagerService} from "./key-manager-services/core-key-manager.service";
import {isNullOrUndefined} from "util";
import {EthereumTransaction} from "../shared/model/ethereum-transaction";
import {Web3Service} from "./web3.service";
import {TokenTickerService} from "./token-ticker.service";

@Injectable()
export class Block16Service {
  public ethereumAssets: BehaviorSubject<EthereumAsset[]>;
  public recentTransactions: BehaviorSubject<EthereumTransaction[]>;

  constructor(
    private httpClient: HttpClient,
    private coreKeyManager: CoreKeyManagerService,
    private web3Service: Web3Service,
    private tokenTickerService: TokenTickerService
  ) {
    this.initBehaviorSubjects();

    // Subscribe to the address and get the assets for the address on address update
    this.coreKeyManager.currentAddress.subscribe((address: string) => {
      if (isNullOrUndefined(address) || address === '') {
        // set the default 0 assets for address, TODO: actual Ethereum balance
        this.ethereumAssets = new BehaviorSubject<EthereumAsset[]>(
          [
            new EthereumAsset('Ethereum', 'ETH', new BigNumber(0), 18, 21000)
          ]
        );
      } else {
        // When the address changes and it's not null or empty
        this.getAssetsForAddress(address).subscribe((assets) => {
          console.log(assets);
          const assetList = [];
          for (let i = 0; i < assets.length; i++) {
            const token = this.tokenTickerService.checkTokenSymbol("0x" + assets[i]);
            debugger;
          }
          this.ethereumAssets.next(assetList);
        });

        this.getTransactionsForAddress(address).subscribe(transactions => {
          console.log(transactions);
          const txList = [];
          for (let i = 0; i < transactions.length; i++) {

          }
          this.recentTransactions.next(txList);
        });
      }
    });
  }

  private initBehaviorSubjects() {
    this.ethereumAssets = new BehaviorSubject<EthereumAsset[]>(
      [
        new EthereumAsset('Ethereum', 'ETH', new BigNumber(0), 18, 21000)
      ]
    );

    this.recentTransactions = new BehaviorSubject([]);
  }

  /**
   * Gets the assets associated with a particular address from the block16 api
   * @param {string} address
   * @returns {Observable<any>}
   */
  public getAssetsForAddress(address: string): Observable<any> {
    const assetUrl = 'http://api.block16.io:8080/v1/address/' + address + '/assets';
    return this.httpClient.get(assetUrl);
  }

  public getTransactionsForAddress(address: string): Observable<any> {
    const assetUrl = 'http://api.block16.io:8080/v1/address/' + address + '/transactions';
    return this.httpClient.get(assetUrl);
  }
}
