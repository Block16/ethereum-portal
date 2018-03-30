import {Observable} from "rxjs/Observable";
import {U2fResponse} from "./u2f-response";
import {webSafe64, wrapApdu} from "./utils";

declare var u2f;
declare var buffer;

export class LedgerTransport {

  constructor(readonly scrambleKey: string, private timeoutSeconds?: number) { }

  public exchange(apduHex): Observable<any> {
    const apdu = new buffer.Buffer(apduHex, 'hex');
    const keyHandle = wrapApdu(apdu, this.scrambleKey);
    const challenge = new buffer.Buffer("0000000000000000000000000000000000000000000000000000000000000000", 'hex');
    const key = {};
    key['version'] = 'U2F_V2';
    key['keyHandle'] = webSafe64(keyHandle.toString('base64'));

    return Observable.create(observer => {
      const localCallback = (result) => {
        const response = new U2fResponse(result);
        !response.isError() ? observer.next(response.u2fResponse) : observer.error(response.u2fResponse);
        observer.complete();
      };
      u2f.sign(location.origin, webSafe64(challenge.toString('base64')), [key], localCallback, this.timeoutSeconds);
    });
  }
}
