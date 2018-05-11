import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Web3Service} from "../../core/web3.service";
import {EthereumAsset} from "../model/ethereum-asset";
import {Subscription} from "rxjs/Subscription";
import {Block16Service} from "../../core/block16.service";
import {UserPreferences} from "../model/user-preferences";
import {UserPreferencesService} from "../../core/user-preferences.service";
import {CoreKeyManagerService} from "../../core/key-manager-services/core-key-manager.service";
import {EthereumTransaction} from "../model/ethereum-transaction";
import {isNullOrUndefined} from "util";
import {BigNumber} from 'bignumber.js';
import * as ethutils from 'ethereumjs-util';

@Component({
  selector: 'app-send-form',
  templateUrl: './send-form.component.html',
  styleUrls: ['./send-form.component.scss']
})
export class SendFormComponent implements OnInit, OnDestroy {
  @Input() theme;
  @Output() ethereumTransaction: EventEmitter<EthereumTransaction> = new EventEmitter<EthereumTransaction>();

  private userPrefSub: Subscription;
  public userPreferences: UserPreferences;

  public currentAddress: string;
  public currentAsset: EthereumAsset;
  public sendForm: FormGroup;

  public sendAmount: BigNumber;
  public previousAmount: BigNumber;

  public sendMax: boolean;

  private assetSubscription: Subscription;
  public assets: EthereumAsset[];

  constructor(
    private formBuilder: FormBuilder,
    private web3Service: Web3Service,
    private assetService: Block16Service,
    private userPrefService: UserPreferencesService,
    private coreKeyManagerService: CoreKeyManagerService
  ) {
    this.currentAddress = "";

    this.userPrefSub = this.userPrefService.userPreferences.subscribe(userPref => {
      this.userPreferences = userPref;
    });

    this.assetSubscription = this.assetService.ethereumAssets.subscribe(assets => {
      this.assets = assets;
    });

    this.coreKeyManagerService.currentAddress.subscribe((address: string) => {
      this.currentAddress = address;
    });

    this.sendMax = false;

    // TODO: Fix this to use the forms
    this.sendAmount = new BigNumber('0');
    this.previousAmount = new BigNumber('0');
    this.currentAsset = this.assets[0];

    this.sendForm = this.formBuilder.group({
      'sendAddress': ['', [ Validators.required, Validators.pattern("(0x){0,1}[a-fA-F0-9]{40}") ] ],
      'sendAmount': ['', [Validators.required]],
      'sendAsset': ['', [Validators.required]]
    });
  }

  clickMaxButton() {
    this.sendMax = !this.sendMax;
    if (this.sendMax) {
      const val = this.sendForm.controls['sendAmount'].value;
      // TODO: if this was a bad value just set it to 0
      this.previousAmount = isNullOrUndefined(val) || val === "" ? new BigNumber('0') : new BigNumber(val);
      this.sendAmount = this.currentAsset.calculatedAmount;
    } else {
      this.sendAmount = this.previousAmount;
      this.previousAmount = this.previousAmount = this.sendForm.controls['sendAmount'].value;
    }
    console.log(this.sendAmount.toString());
    this.sendForm.controls['sendAmount'].setValue(this.currentAsset.calculatedAmount.toString());
  }

  ngOnInit() { }

  ngOnDestroy(): void {
    this.userPrefSub.unsubscribe();
  }

  toHex(n: number|string|BigNumber): string {
    return this.web3Service.getWebInstance().utils.toHex(n);
  }

  toGwei(n: string): string {
    return this.toHex(this.web3Service.getWebInstance().utils.toWei(n, 'gwei'));
  }

  erc20Transfer(toAddress: string, value: BigNumber): string {
    return this.web3Service.getWebInstance().eth.abi.encodeFunctionCall({
      "constant": false,
      "inputs": [
        {
          "name": "_to",
          "type": "address"
        },
        {
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }, [toAddress, value]);
  }

  generateTransaction() {
    const sendAsset = <EthereumAsset>this.sendForm.controls['sendAsset'].value;
    let rawAmount = this.toHex(sendAsset.amountToRaw(this.sendForm.controls['sendAmount'].value)); // parameter or hex
    let data = '0x'; // hex prefix if actual data
    let toAddress = ethutils.addHexPrefix(this.sendForm.controls['sendAddress'].value);
    let tokenToAddress = ''; // only if we are doing a token TX
    let tokenValue = new BigNumber('0');

    // TODO: Manual gas
    const gasPrice = this.toGwei('8');
    const gasLimit = this.toHex(sendAsset.gasLimit);

    // If we are not sending eth, we need to use the contract's address
    if (sendAsset.symbol !== 'ETH') {
      if (isNullOrUndefined(sendAsset.contractAddress)) {
        throw new Error('Couldn\'t find address for contract, cannot send tokens');
      }
      // TODO: Assumption you have to send 0 value to transfer erc20 tokens always
      rawAmount = this.toHex(0);
      tokenToAddress = toAddress;
      data = this.erc20Transfer(toAddress, sendAsset.amountToRaw(this.sendForm.controls['sendAmount'].value));
      tokenValue = sendAsset.amountToRaw(this.sendForm.controls['sendAmount'].value);
      toAddress = sendAsset.contractAddress;
    }

    this.web3Service.getTransactionCount(this.coreKeyManagerService.currentAddress.value).subscribe((count: number) => {
      const nonce = this.toHex(count);
      const transaction = new EthereumTransaction(gasLimit, gasPrice, this.currentAddress, toAddress, rawAmount, nonce, data);
      transaction.tokenToAddress = tokenToAddress;
      transaction.asset = sendAsset;
      transaction.tokenValue = tokenValue;
      this.ethereumTransaction.emit(transaction);
    });
  }
}
