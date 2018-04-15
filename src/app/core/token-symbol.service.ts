import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import * as tokendata from './static-models/ethereum-tokens.json';

@Injectable()
export class TokenSymbolService {

  constructor() {
    console.log(tokendata);
  }

  public checkTokenSymbol(address) {
    // should use a find here instead, filter could be empty which would throw an array out of bounds error
    // !!!!!
    // const result = (<any[]>tokendata).filter((obj) => {
    //   return obj.contract_address === address;
    // });
    const result = tokendata.find( obj => obj.contract_address === address );
    return result[0];
  }

}
