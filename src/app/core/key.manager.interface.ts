import {Observable} from 'rxjs/Observable';
import {EthereumTransaction} from '../shared/model/EthereumTransaction';

export interface KeyManagerService {
  getEthereumAddresses(): Observable<string[]>;
  signTransaction(transaction: EthereumTransaction): Observable<EthereumTransaction>;
  resetState();
}
