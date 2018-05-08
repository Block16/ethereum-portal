/********************************************************************************
 *   Ledger Communication toolkit
 *   (c) 2016 Ledger
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 ********************************************************************************/

'use strict';

var LedgerEth = function (comm) {
  this.comm = comm;

  this

  this.getAddress = function (path, callback, boolDisplay, boolChaincode) {
    var splitPath = LedgerEth.splitPath(path);
    var b = new buffer.Buffer(5 + 1 + splitPath.length * 4);
    b[0] = 0xe0;
    b[1] = 0x02;
    b[2] = (boolDisplay ? 0x01 : 0x00);
    b[3] = (boolChaincode ? 0x01 : 0x00);
    b[4] = 1 + splitPath.length * 4;
    b[5] = splitPath.length;
    splitPath.forEach(function (element, index) {
      b.writeUInt32BE(element, 6 + 4 * index);
    });
    var self = this;
    var localCallback = function (response, error) {
      if (typeof error != "undefined") {
        callback(undefined, error);
      }
      else {
        var result = {};
        response = new buffer.Buffer(response, 'hex');
        var sw = response.readUInt16BE(response.length - 2);
        if (sw != 0x9000) {
          callback(undefined, "Invalid status " + sw.toString(16) + ". Check to make sure the right application is selected ?");
          return;
        }
        var publicKeyLength = response[0];
        var addressLength = response[1 + publicKeyLength];
        result['publicKey'] = response.slice(1, 1 + publicKeyLength).toString('hex');
        result['address'] = "0x" + response.slice(1 + publicKeyLength + 1, 1 + publicKeyLength + 1 + addressLength).toString('ascii');
        if (boolChaincode) {
          result['chainCode'] = response.slice(1 + publicKeyLength + 1 + addressLength, 1 + publicKeyLength + 1 + addressLength + 32).toString('hex');
        }
        callback(result);
      }
    };
    this.comm.exchange(b.toString('hex'), localCallback);
  };

  this.signTransaction = function (path, rawTxHex, callback) {
    var splitPath = LedgerEth.splitPath(path);
    var offset = 0;
    var rawTx = new buffer.Buffer(rawTxHex, 'hex');
    var apdus = [];
    while (offset != rawTx.length) {
      var maxChunkSize = (offset == 0 ? (150 - 1 - splitPath.length * 4) : 150)
      var chunkSize = (offset + maxChunkSize > rawTx.length ? rawTx.length - offset : maxChunkSize);
      var b = new buffer.Buffer(offset == 0 ? 5 + 1 + splitPath.length * 4 + chunkSize : 5 + chunkSize);
      b[0] = 0xe0;
      b[1] = 0x04;
      b[2] = (offset == 0 ? 0x00 : 0x80);
      b[3] = 0x00;
      b[4] = (offset == 0 ? 1 + splitPath.length * 4 + chunkSize : chunkSize);
      if (offset == 0) {
        b[5] = splitPath.length;
        splitPath.forEach(function (element, index) {
          b.writeUInt32BE(element, 6 + 4 * index);
        });
        rawTx.copy(b, 6 + 4 * splitPath.length, offset, offset + chunkSize);
      }
      else {
        rawTx.copy(b, 5, offset, offset + chunkSize);
      }
      apdus.push(b.toString('hex'));
      offset += chunkSize;
    }
    var self = this;
    var localCallback = function (response, error) {
      if (typeof error != "undefined") {
        callback(undefined, error);
      }
      else {
        response = new buffer.Buffer(response, 'hex');
        var sw = response.readUInt16BE(response.length - 2);
        if (sw != 0x9000) {
          callback(undefined, "Invalid status " + sw.toString(16) + ". Check to make sure contract data is on ?");
          return;
        }
        if (apdus.length == 0) {
          var result = {};
          result['v'] = response.slice(0, 1).toString('hex');
          result['r'] = response.slice(1, 1 + 32).toString('hex');
          result['s'] = response.slice(1 + 32, 1 + 32 + 32).toString('hex');
          callback(result);
        }
        else {
          self.comm.exchange(apdus.shift(), localCallback);
        }
      }
    };
    self.comm.exchange(apdus.shift(), localCallback);
  };

  this.getAppConfiguration = function (callback) {
    var b = new buffer.Buffer(5);
    b[0] = 0xe0;
    b[1] = 0x06;
    b[2] = 0x00;
    b[3] = 0x00;
    b[4] = 0x00;
    var localCallback = function (response, error) {
      if (typeof error != "undefined") {
        callback(undefined, error);
      }
      else {
        response = new buffer.Buffer(response, 'hex');
        var result = {};
        var sw = response.readUInt16BE(response.length - 2);
        if (sw != 0x9000) {
          callback(undefined, "Invalid status " + sw.toString(16) + ". Check to make sure the right application is selected ?");
          return;
        }
        result['arbitraryDataEnabled'] = (response[0] & 0x01);
        result['version'] = "" + response[1] + '.' + response[2] + '.' + response[3];
        callback(result);
      }
    };
    this.comm.exchange(b.toString('hex'), localCallback);
  };
};


