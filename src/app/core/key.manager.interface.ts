import {Observable} from 'rxjs/Observable';
import {EthereumTransaction} from '../shared/model/ethereum-transaction';

export interface KeyManagerService {
  getEthereumAddresses(): Observable<string[]>;
  signTransaction(transaction: EthereumTransaction): Observable<EthereumTransaction>;
  resetState();
}
