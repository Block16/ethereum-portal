import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {EthereumAsset} from "../shared/model/ethereum-asset";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {CoreKeyManagerService} from "./key-manager-services/core-key-manager.service";
import {isNullOrUndefined} from "util";
import {EthereumTransaction} from "../shared/model/ethereum-transaction";
import {Web3Service} from "./web3.service";
import {TokenTickerService} from "./token-ticker.service";
import {forkJoin} from 'rxjs/observable/forkJoin';
import {TransactionInformation} from "../shared/model/transaction-information";
import {BigNumber} from 'bignumber.js';

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
            new EthereumAsset('Ethereum', 'ETH', new BigNumber(0), 18, "", 21000)
          ]);
      } else {

        // When the address changes and it's not null or empty
        this.getAssetsForAddress(address).subscribe((assets) => {
          const assetList = [];

          const decimalsObservables = [];
          const symbolObservables = [];
          const nameObservables = [];
          const balanceObservables = [];

          for (let i = 0; i < assets.data.length; i++) {
            // const token = this.tokenTickerService.checkTokenSymbol("0x" + assets.data[i]);
            decimalsObservables.push(this.web3Service.getDecimals(assets.data[i]));
            symbolObservables.push(this.web3Service.getTokenSymbol(assets.data[i]));
            nameObservables.push(this.web3Service.getTokenName(assets.data[i]));
            balanceObservables.push(this.web3Service.getTokenBalance(assets.data[i], address));
          }

          let decimalForked = forkJoin(decimalsObservables);
          let symbolForked = forkJoin(symbolObservables);
          let nameForked = forkJoin(nameObservables);
          let balanceForked = forkJoin(balanceObservables);

          // This is for when the user has no detected assets - non ERC20 Transfer Event
          if (assets.data.length === 0) {
            decimalForked = Observable.of([]);
            symbolForked = Observable.of([]);
            nameForked = Observable.of([]);
            balanceForked = Observable.of([]);
          }

          forkJoin(
            this.getTransactionsForAddress(address),
            this.web3Service.getBalance(address),
            decimalForked,
            symbolForked,
            nameForked,
            balanceForked
          ).subscribe(([transactions, ethBalance, decimals, symbols, names, balances]) => {

            const ethAsset = new EthereumAsset('Ethereum', 'ETH', new BigNumber(ethBalance), 18, "", 21000);

            // Build the list of assets first
            assetList.push(ethAsset);

            for (let i = 0; i < decimals.length; i++) {

              const tokenData = this.tokenTickerService.checkTokenSymbol(<string>assets.data[i]);

              assetList.push(
                new EthereumAsset(
                  <string>names[i],
                  <string>symbols[i],
                  <BigNumber>balances[i],
                  <number>decimals[i],
                  <string>assets.data[i],
                  65000,
                  !!tokenData
                )
              );
            }

            this.ethereumAssets.next(assetList);

            // Transactions //
            const txList = [];

            for (let i = 0; i < transactions.data.length; i++) {
              let asset: EthereumAsset;
              let symbol = "ETH";
              let value: BigNumber = ethAsset.calculateAmount(new BigNumber(transactions.data[i].value));

              if (transactions.data[i].transactionType === "token_transaction") {
                asset = this.findInAssetListByContract(transactions.data[i].ethereumContract);
                value = asset.calculateAmount(new BigNumber(transactions.data[i].value));
                symbol = asset.symbol;

              }

              const transaction = new TransactionInformation(
                transactions.data[i].toAddress,
                transactions.data[i].fromAddress,
                "confirmed",
                transactions.data[i].blockNumber,
                transactions.data[i].fromAddress.toLowerCase() === transactions.data[i].key.address.toLowerCase() ? "to" : "from",
                symbol,
                value.toFixed(),
                transactions.data[i].key.transactionDate,
                transactions.data[i].transactionHash
              );

              txList.push(transaction);
            }

            this.recentTransactions.next(txList);

          }, (err) => {
            console.log(err);
          });
        });
      }
    });
  }

  private initBehaviorSubjects() {
    this.ethereumAssets = new BehaviorSubject<EthereumAsset[]>(
      [
        new EthereumAsset('Ethereum', 'ETH', new BigNumber(0), 18, "", 21000)
      ]
    );
    this.recentTransactions = new BehaviorSubject([]);
  }

  private findInAssetListByContract(a: string, assetList?: EthereumAsset[]): EthereumAsset {
    const list = isNullOrUndefined(assetList) ? this.ethereumAssets.value : assetList;
    return list.find(asset => {
      if (isNullOrUndefined(asset.contractAddress) || asset.contractAddress === "") {
        return false;
      }
      return asset.contractAddress.toLowerCase() === a.toLowerCase();
    });
  }

  /**
   * Gets the assets associated with a particular address from the block16 api
   * @param {string} address
   * @returns {Observable<any>}
   */
  public getAssetsForAddress(address: string): Observable<any> {
    const assetUrl = 'http://api.block16.io/v1/address/' + address + '/assets';
    return this.httpClient.get(assetUrl);
  }

  public getTransactionsForAddress(address: string): Observable<any> {
    const assetUrl = 'http://api.block16.io/v1/address/' + address + '/transactions';
    return this.httpClient.get(assetUrl);
  }
}
