import {Observable} from 'rxjs/Observable';
import {EthereumTransaction} from "../../shared/model/ethereum-transaction";


export interface KeyManagerService {
  approveAndSend(transaction: EthereumTransaction): Observable<string>;
  getEthereumAddresses(): Observable<string[]>;
  signTransaction(transaction: EthereumTransaction): Observable<EthereumTransaction>;
  resetState();
}
