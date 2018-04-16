import {Injectable} from '@angular/core';
import {EthereumTokens} from './static-models/ethereum-tokens';

@Injectable()
export class TokenSymbolService {

  constructor() {
    console.log(EthereumTokens);
  }

  public checkTokenSymbol(address) {
    return EthereumTokens.find( obj => obj.contractAddress === address );
  }

}
