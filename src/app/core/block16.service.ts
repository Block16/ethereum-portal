import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {EthereumAsset} from "../shared/model/ethereum-asset";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {CoreKeyManagerService} from "./key-manager-services/core-key-manager.service";
import {isNull, isNullOrUndefined} from "util";
import {EthereumTransaction} from "../shared/model/ethereum-transaction";
import {Web3Service} from "./web3.service";
import {TokenTickerService} from "./token-ticker.service";
import {forkJoin} from 'rxjs/observable/forkJoin';
import {TransactionInformation} from "../shared/model/transaction-information";
import {BigNumber} from 'bignumber.js';
import {NotificationService} from "./notification.service";

@Injectable()
export class Block16Service {
  public ethereumAssets: BehaviorSubject<EthereumAsset[]>;
  public transactions: BehaviorSubject<TransactionInformation[]>;
  public pendingTransactions: BehaviorSubject<TransactionInformation[]>;

  constructor(
    private httpClient: HttpClient,
    private coreKeyManager: CoreKeyManagerService,
    private web3Service: Web3Service,
    private tokenTickerService: TokenTickerService,
    private notificationService: NotificationService
  ) {
    this.intervalLoopInit();

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

            // Parse transaction data
            const txList = [];
            for (let i = 0; i < transactions.data.length; i++) {
              txList.push(this.parseRemoteTxData(transactions.data[i]));
            }
            this.transactions.next(txList);
          }, (err) => {
            console.log(err);
          });
        });
      }
    });
  }

  /**
   *
   * @param data
   * @returns {TransactionInformation}
   */
  private parseRemoteTxData(data: any): TransactionInformation {
    let asset = this.findEthereumAsset();
    let symbol = "ETH";
    let value: BigNumber = asset.calculateAmount(new BigNumber(data.value));

    if (data.transactionType === "token_transaction") {
      asset = this.findInAssetListByContract(data.ethereumContract);
      value = asset.calculateAmount(new BigNumber(data.value));
      symbol = asset.symbol;
    }

    return new TransactionInformation(
      data.toAddress,
      data.fromAddress,
      "confirmed",
      data.blockNumber,
      data.fromAddress.toLowerCase() === data.key.address.toLowerCase() ? "to" : "from",
      symbol,
      value,
      data.key.transactionDate,
      data.transactionHash
    );
  }

  /**
   *
   * @param {EthereumTransaction} ethTx
   * @returns {TransactionInformation}
   */
  private ethTransactionToTransactionInfo(ethTx: EthereumTransaction): TransactionInformation {
    let val = ethTx.asset.calculateAmount(new BigNumber(ethTx.value));
    console.log("value: " + val);
    if (ethTx.asset.symbol !== 'ETH') {
      val = ethTx.asset.calculateAmount(ethTx.tokenValue);
    }
    return new TransactionInformation(
      ethTx.toAddress,
      ethTx.fromAddress,
      "processing",
      0,
      ethTx.fromAddress.toLowerCase() === this.coreKeyManager.currentAddress.getValue().toLowerCase() ? "to" : "from",
      ethTx.asset.symbol,
      val,
      new Date().getMilliseconds(),
      ethTx.hash
    );
  }

  /**
   *
   */
  private intervalLoopInit() {
    this.ethereumAssets = new BehaviorSubject<EthereumAsset[]>(
      [ new EthereumAsset('Ethereum', 'ETH', new BigNumber(0), 18, "", 21000) ]
    );

    this.transactions = new BehaviorSubject([]);

    // TODO: Load recent transactions from temp storage
    this.pendingTransactions = new BehaviorSubject([]);

    // Initialize the recentTransaction checker
    setInterval(() => {
      const p = this.pendingTransactions.value;

      for (let i = p.length - 1; i >= 0; i--) {

        // Helper to remove from pending TX list
        const remove = (status: string, blockNumber?: number): TransactionInformation => {
          const tempTxInfo = p[i];
          p.splice(i, 1);
          this.pendingTransactions.next(p);
          tempTxInfo.status = "confirmed";
          if(isNullOrUndefined(blockNumber)) {
            tempTxInfo.blockNumber = 0;
          } else {
            tempTxInfo.blockNumber = blockNumber;
          }
          tempTxInfo.created = new Date();

          // Add to TX list
          const completeTxs = this.transactions.value;
          completeTxs.unshift(tempTxInfo);
          this.transactions.next(completeTxs);
          return tempTxInfo;
        };

        // TODO: Update correct amount of tokens for this asset based on how many were sent in recent

        this.web3Service.getTransactionReciept(p[i].hash).subscribe((val) => {
          // It's been included if it's defined
          if (!isNullOrUndefined(val)) {
            const message = "Transaction to " + p[i].toAddress + " for " + p[i].amount + " is successful.";
            this.notificationService.message(message, "Transaction Success");
            remove("confirmed", val.blockNumber);
            this.savePendingTransactions();
          } else {
            console.log("Transaction hasn't been included in block yet: " + p[i].hash);
            // Remove transactions that are polling for more than an hour
            if (p[i].greaterThanHour()) {
              const removedTx = remove("failed", 0);
              this.savePendingTransactions();
              this.updateFailedTransactions(removedTx);
              const message = "Transaction to " + removedTx.toAddress + " for " + removedTx.amount + " failed";
              this.notificationService.message(message, "Transaction failure");
            }
          }
        });
      }
    }, 5000);
  }

  /**
   *
   * @param {string} a
   * @param {EthereumAsset[]} assetList
   * @returns {EthereumAsset}
   */
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
   *
   * @returns {EthereumAsset}
   */
  private findEthereumAsset() {
    return this.ethereumAssets.value.find(a => a.symbol === 'ETH');
  }

  /**
   * Gets the assets associated with a particular address from the block16 api
   * @param {string} address
   * @returns {Observable<any>}
   */
  private getAssetsForAddress(address: string): Observable<any> {
    const assetUrl = 'http://api.block16.io/v1/address/' + address + '/assets';
    return this.httpClient.get(assetUrl);
  }

  private getTransactionsForAddress(address: string): Observable<any> {
    const assetUrl = 'http://api.block16.io/v1/address/' + address + '/transactions';
    return this.httpClient.get(assetUrl);
  }

  public newRecentTransaction(ethereumTransaction: EthereumTransaction) {
    const txs = this.pendingTransactions.value;
    txs.push(this.ethTransactionToTransactionInfo(ethereumTransaction));
    this.pendingTransactions.next(txs);
  }

  private loadFailedTransactions(): TransactionInformation[] {
    let failed: any = localStorage.getItem("failed");
    if(isNullOrUndefined(failed)) {
      failed = [];
    } else {
      failed = JSON.parse(failed);
    }
    const txs = [];
    failed.forEach((tx: any) => {
      txs.push(TransactionInformation.fromJsonRep(tx));
    });
    return txs;
  }

  private updateFailedTransactions(txInfo: TransactionInformation): void {
    const failed = this.loadFailedTransactions();
    failed.push(txInfo);
    const jsonRep = [];
    failed.forEach((info: TransactionInformation) => {
      jsonRep.push(info.toJsonRep());
    });
    localStorage.setItem("failed", JSON.stringify(jsonRep));
  }

  private loadPendingTransactions(): TransactionInformation[] {
    let pending: any = localStorage.getItem("pending");
    if (isNullOrUndefined(pending)) {
      pending = [];
    } else {
      pending = JSON.parse(pending);
    }
    const txs = [];
    pending.forEach((tx: any) => {
      txs.push(TransactionInformation.fromJsonRep(tx));
    });
    return txs;
  }

  private savePendingTransactions(): void {
    const recent = [];
    const p = this.pendingTransactions.value;
    p.forEach((txInfo: TransactionInformation) => {
      recent.push(txInfo.toJsonRep());
    });
    localStorage.setItem("pending", JSON.stringify(recent));
  }
}
