import * as ethutils from 'ethereumjs-util';
declare var buffer;

export function privateKeyToAddress(privateKey: string): string {
  // Sitewide we don't deal with 0x prefix
  if (privateKey.length !== 64) {
    throw new Error("Private key was not length 64, was length: " + privateKey.length);
  }
  return ethutils.privateToAddress(parseInt(privateKey, 16)).toString('hex');
}

export function webSafe64(base64): string {
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function normal64(base64): string {
  return base64.replace(/\-/g, '+').replace(/_/g, '/') + '=='.substring(0, (3 * base64.length) % 4);
}

export function  wrapApdu(apdu, key) {
  const result = new buffer.Buffer(apdu.length);
  for (let i = 0; i < apdu.length; i++) {
    result[i] = apdu[i] ^ key[i % key.length];
  }
  return result;
}

export function splitPath(path) {
  const result = [];
  const components = path.split('/');
  components.forEach(function (element, index) {
    let number = parseInt(element, 10);
    if (isNaN(number)) {
      return;
    }
    if ((element.length > 1) && (element[element.length - 1] === "'")) {
      number += 0x80000000;
    }
    result.push(number);
  });
  return result;
}
