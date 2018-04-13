import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Web3Service} from "../../core/web3.service";
import {EthereumAsset} from "../model/ethereum-asset";
import {Subscription} from "rxjs/Subscription";
import {EthereumAssetService} from "../../core/ethereum-asset.service";
import {UserPreferences} from "../model/user-preferences";
import {UserPreferencesService} from "../../core/user-preferences.service";
import {CoreKeyManagerService} from "../../core/key-manager-services/core-key-manager.service";
import {EthereumTransaction} from "../model/ethereum-transaction";
import {isNullOrUndefined} from "util";
import * as Web3 from "web3";

@Component({
  selector: 'app-send-form',
  templateUrl: './send-form.component.html',
  styleUrls: ['./send-form.component.scss']
})
export class SendFormComponent implements OnInit, OnDestroy {
  @Input() theme;

  private userPrefSub: Subscription;
  public userPreferences: UserPreferences;

  public currentAsset: EthereumAsset;
  public sendForm: FormGroup;
  public sendAmount: number;
  public sendMax: boolean;

  private assetSubscription: Subscription;
  public assets: EthereumAsset[];

  private previousAmount: any;

  constructor(
    private formBuilder: FormBuilder,
    private web3Service: Web3Service,
    private assetService: EthereumAssetService,
    private userPrefService: UserPreferencesService,
    private coreKeyManagerService: CoreKeyManagerService
  ) {
    this.userPrefSub = this.userPrefService.userPreferences.subscribe(userPref => {
      this.userPreferences = userPref;
    });

    this.assetSubscription = this.assetService.ethereumAssets.subscribe(assets => {
      this.assets = assets;
    });

    this.sendMax = false;

    // TODO: Fix this to use the forms
    this.sendAmount = 0;
    this.previousAmount = 0;
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
      this.previousAmount = this.sendAmount;
      // this.sendAmount = this.currentAsset.calculatedAmount().toString();
    } else {
      this.sendAmount = this.previousAmount;
    }
  }

  ngOnInit() {

  }


  ngOnDestroy(): void {
    this.userPrefSub.unsubscribe();
  }

  toHex(n: number|string|BigNumber): string {
    return this.web3Service.getWebInstance().utils.toHex(n);
  }

  keccak(preKeccak: string): string {
    return this.web3Service.getWebInstance().utils.keccak256(preKeccak);
  }

  erc20Transfer(fromAddress: string, toAddress: string, value: number|string): string {
    return this.keccak('Transfer(' + fromAddress + ',' + toAddress + ',' + value.toString() + ')');
  }

  sendTransaction() {
    const fromAddress = '0x' + this.coreKeyManagerService.currentAddress.value;
    const sendAsset = <EthereumAsset>this.sendForm.controls['sendAsset'].value;
    let rawAmount = this.toHex(sendAsset.amountToRaw(this.sendForm.controls['sendAmount'].value)); // parameter or hex
    let data = ''; // hex prefix if actual data
    let toAddress = this.sendForm.controls['sendAddress'].value;

    // has to have hex prefix to be used with web3
    if (!toAddress.startsWith('0x')) {
      toAddress = '0x' + toAddress;
    }

    // TODO: Manual gas
    const gasPrice = this.toHex(8);
    const gasLimit = this.toHex(sendAsset.gasLimit);

    // TODO: Get nonce for transaction
    const nonce = this.toHex(0); // hex

    // If we are not sending eth, we need to use the contract's address
    if (sendAsset.symbol !== 'ETH') {
      if (isNullOrUndefined(sendAsset.contractAddress)) {
        throw new Error('Couldn\'t find address for contract, cannot send tokens');
      }
      // TODO: Assumption you have to send 0 value to transfer erc20 tokens always
      rawAmount = this.toHex(0);
      data = this.erc20Transfer(fromAddress, toAddress, sendAsset.amountToRaw(this.sendForm.controls['sendAmount'].value).toString());
      toAddress = sendAsset.contractAddress;
    }

    const transaction = new EthereumTransaction(gasLimit, gasPrice, toAddress, rawAmount, nonce, data);

    console.log(transaction);

    this.coreKeyManagerService.signTransaction(transaction).subscribe((t: EthereumTransaction) => {
      console.log(t);
      // TODO: Build transaction, use core key manager, make sure the provider is correct here - might need another
      // web3 instance
      this.web3Service.sendRawTransaction(t).subscribe((result: string) => {
        console.log('ok');
      });
    });
  }

}
