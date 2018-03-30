import {normal64} from "./utils";

declare var buffer;

export class U2fResponse {

  private err: boolean;
  readonly u2fResponse: any;

  constructor(response: any) {
    if (typeof response['signatureData'] !== "undefined") {
      // TODO: two different u2fResponse types
      const data = new buffer.Buffer((normal64(response['signatureData'])), 'base64');
      this.u2fResponse = data.toString('hex', 5);
      this.err = false;
    } else {
      this.u2fResponse = response;
      this.err = true;
    }
  }

  isError(): boolean {
    return this.err;
  }
}
