import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import * as tokendata from './static-models/ethereum-tokens.json';

@Injectable()
export class TokenSymbolService {
  constructor() {
    console.log(tokendata);
  }

  public checkTokenSymbol(address) {
    return (<any[]>tokendata).find( obj => obj.contract_address === address );
  }

}
