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
import {TransactionInformation} from "../shared/model/transaction-information";

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
          const assetList = [];
          for (let i = 0; i < assets.data.length; i++) {
            const token = this.tokenTickerService.checkTokenSymbol("0x" + assets.data[i]);
          }

          this.ethereumAssets.next(assetList);

          this.getTransactionsForAddress(address).subscribe(transactions => {
            const txList = [];
            for (let i = 0; i < transactions.data.length; i++) {
              const transaction = new TransactionInformation(
                transactions.data[i].toAddress,
                transactions.data[i].fromAddress,
                "confirmed",
                transactions.data[i].blockNumber,
                transactions.data[i].toAddress === transactions.data[i].key.address ? "to" : "from",
                new EthereumAsset("Chicken", "CKN", transactions.data[i].value, 18),
                transactions.data[i].value,
                transactions.data[i].created
              );

              txList.push(transaction);
              /*

              {
                'toAddress': toAddress,
                'fromAddress': fromAddress,
                'status': status,
                'kind': kind,
                'confirmations': confirmations,
                'asset': asset,
                'amount': amount,
                'created': new Date()
                };

               */

              /*

              "key": {
                "address": "3c4a4f32615c04aa178926137745f5b005f37eaa",
                  "transactionDate": "2018-01-07T05:43:36.000+0000",
                  "txIndexKey": 88,
                  "txLogIndex": 83
              },
              "value": "10000000000000000000000",
                "toAddress": "3c4a4f32615c04aa178926137745f5b005f37eaa",
                "fromAddress": "f1c4f0ccd9cd1e3b7dee7c13705fdddc6c7f291f",
                "ethereumContract": "541ed2600fac28e7ab5d22c3bd3ad4361aa82591",
                "transactionHash": "54c56c184fd885271ffacd5e36fc6c423f1cd1b16a1643211a7d3034f28fc80b",
                "blockNumber": 4867416,
                "transactionType": "token_transaction",
                "fee": "1032120000000000"
            },

            */

            }
            this.recentTransactions.next(txList);
          });
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
