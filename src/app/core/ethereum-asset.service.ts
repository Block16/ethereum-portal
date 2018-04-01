import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {EthereumAsset} from "../shared/model/ethereum-asset";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class EthereumAssetService {

  private address: string;
  public ethereumAssets: BehaviorSubject<EthereumAsset[]>;

  constructor(
    private httpClient: HttpClient
  ) {
    this.address = '';
    this.ethereumAssets = new BehaviorSubject<EthereumAsset[]>([new EthereumAsset('ETH', 0, 18)]);
  }

  public updateAddress(address: string) {
    this.address = address;
  }

}
