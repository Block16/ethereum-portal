import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {EthereumAsset} from "../shared/model/ethereum-asset";
import {HttpClient} from "@angular/common/http";
import {BigNumber} from "bignumber.js";

@Injectable()
export class EthereumAssetService {

  private address: string;
  public ethereumAssets: BehaviorSubject<EthereumAsset[]>;

  constructor(
    private httpClient: HttpClient
  ) {
    this.address = '';
    this.ethereumAssets = new BehaviorSubject<EthereumAsset[]>([new EthereumAsset('Ethereum', 'ETH', new BigNumber(0), 18, 21000)]);
  }

  // TODO: This would be better served as a subscription
  public updateAddress(address: string) {
    this.address = address;
  }

}
