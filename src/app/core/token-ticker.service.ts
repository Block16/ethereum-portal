import {Injectable} from '@angular/core';
import {EthereumTokens, TokenData} from './static-models/ethereum-tokens';
import * as ethutils from 'ethereumjs-util';

@Injectable()
export class TokenTickerService {

  constructor() { }

  public checkTokenSymbol(address): TokenData {
  	return EthereumTokens.find(obj => {
  	  return ethutils.addHexPrefix(obj.contractAddress.toLowerCase()) === ethutils.addHexPrefix(address.toLowerCase());
    });
  }

}
