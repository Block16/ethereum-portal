import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {EthereumAsset} from "../shared/model/ethereum-asset";
import {HttpClient} from "@angular/common/http";
import {BigNumber} from "bignumber.js";
import {Observable} from "rxjs/Observable";
import {CoreKeyManagerService} from "./key-manager-services/core-key-manager.service";
import {isNullOrUndefined} from "util";
import {EthereumTransaction} from "../shared/model/ethereum-transaction";

@Injectable()
export class Block16Service {
  public ethereumAssets: BehaviorSubject<EthereumAsset[]>;
  public recentTransactions: BehaviorSubject<EthereumTransaction[]>;

  constructor(
    private httpClient: HttpClient,
    private coreKeyManager: CoreKeyManagerService
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

        // this.getTransactionsForAddress(address).subscribe((transactions) => {
        //   console.log("Transactoins");
        //   console.log(transactions);
        // });

        // this.getAssetsForAddress(address).subscribe((assets) => {
        //   // TODO: Ask infura about the assests that we just got back

        //   assets = assets.filter((a) => a.isContract === true).map;
        //   console.log("assets");
        //   console.log(assets);
        // });
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
