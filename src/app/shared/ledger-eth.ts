import {LedgerTransport} from "./ledger-transport";
import {Observable} from "rxjs/Observable";
import {splitPath} from "./utils";

declare let buffer;

export class LedgerEth {
  constructor(private transport: LedgerTransport) { }

  scan(path): Observable<any> {
    return this.getAddress(path, false, true);
  }

  getAddress(path, display?: boolean, chaincode?: boolean): Observable<any> {
    const split = splitPath(path);
    const b = new buffer.Buffer(5 + 1 + split.length * 4);
    b[0] = 0xe0;
    b[1] = 0x02;
    b[2] = (display ? 0x01 : 0x00);
    b[3] = (chaincode ? 0x01 : 0x00);
    b[4] = 1 + split.length * 4;
    b[5] = split.length;
    split.forEach(function (element, index) {
      b.writeUInt32BE(element, 6 + 4 * index);
    });
    
    return Observable.create(observer => {
      this.transport.exchange(b.toString('hex')).subscribe(response => {
        const result = {};
        response = new buffer.Buffer(response, 'hex');
        const sw = response.readUInt16BE(response.length - 2);

        if (sw != 0x9000) {
          observer.error("Invalid status " + sw.toString(16) + ". Check to make sure the right application is selected ?");
          observer.complete();
        }

        const publicKeyLength = response[0];
        const addressLength = response[1 + publicKeyLength];

        result['publicKey'] = response.slice(1, 1 + publicKeyLength).toString('hex');
        result['address'] = "0x" + response.slice(1 + publicKeyLength + 1, 1 + publicKeyLength + 1 + addressLength).toString('ascii');

        if (chaincode) {
          result['chainCode'] =
            response.slice(1 + publicKeyLength + 1 + addressLength, 1 + publicKeyLength + 1 + addressLength + 32).toString('hex');
        }

        observer.next(result);
        observer.complete();
      }, err => {
        observer.error(err);
        observer.complete();
      });
    });
  }

  signPersonalMessage_async(path, messageHex, callback) {
    const split = splitPath(path);
    let offset = 0;
    const message = new buffer.Buffer(messageHex, 'hex');
    const apdus = [];
    const response = [];
    while (offset != message.length) {
      const maxChunkSize = (offset == 0 ? (150 - 1 - split.length * 4 - 4) : 150)
      const chunkSize = (offset + maxChunkSize > message.length ? message.length - offset : maxChunkSize);
      const b = new buffer.Buffer(offset == 0 ? 5 + 1 + split.length * 4 + 4 + chunkSize : 5 + chunkSize);
      b[0] = 0xe0;
      b[1] = 0x08;
      b[2] = (offset == 0 ? 0x00 : 0x80);
      b[3] = 0x00;
      b[4] = (offset == 0 ? 1 + split.length * 4 + 4 + chunkSize : chunkSize);
      if (offset == 0) {
        b[5] = split.length;
        split.forEach(function (element, index) {
          b.writeUInt32BE(element, 6 + 4 * index);
        });
        b.writeUInt32BE(message.length, 6 + 4 * split.length);
        message.copy(b, 6 + 4 * split.length + 4, offset, offset + chunkSize);
      } else {
        message.copy(b, 5, offset, offset + chunkSize);
      }
      apdus.push(b.toString('hex'));
      offset += chunkSize;
    }

    const localCallback = (r, error) => {
      if (typeof error != "undefined") {
        callback(undefined, error);
      } else {
        r = new buffer.Buffer(r, 'hex');
        const sw = r.readUInt16BE(r.length - 2);
        if (sw != 0x9000) {
          callback(undefined, "Invalid status " + sw.toString(16) + ". Check to make sure the right application is selected ?");
          return;
        }
        if (apdus.length == 0) {
          const result = {};
          result['v'] = r.slice(0, 1).toString('hex');
          result['r'] = r.slice(1, 1 + 32).toString('hex');
          result['s'] = r.slice(1 + 32, 1 + 32 + 32).toString('hex');
          callback(result);
        } else {
          // this.transport.exchange(apdus.shift(), localCallback);
        }
      }
    };
    // this.transport.exchange(apdus.shift(), localCallback);
  }
}
