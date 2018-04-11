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
import Web3 from "web3";

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

  // input states
  public sendAmountFocus = false;

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

  sendTransaction() {
    const sendAsset = <EthereumAsset>this.sendForm.controls['sendAsset'].value;
    const premodifiedAmount = this.sendForm.controls['sendAmount'].value;

    let toAddress = this.sendForm.controls['sendAddress'].value; // has to be hex
    const rawAmount = Web3.sendAsset.amountToRaw(premodifiedAmount); // parameter or hex
    const nonce = 0; // hex
    let data = ''; // hex

    // TODO: Manual gas

    // If we are not sending eth, we need to use the contract's address
    if (sendAsset.symbol !== 'ETH') {
      // take the target address and hold
      const tempAddress = toAddress;
      if (isNullOrUndefined(sendAsset.contractAddress)) {
        throw new Error('Couldn\'t find address for contract, cannot send tokens');
      }
      toAddress = sendAsset.contractAddress;
      // TODO: From address, transfer etc
      data = tempAddress;
    }

    console.log(sendAsset);
    console.log(premodifiedAmount);
    console.log(toAddress);
    console.log(rawAmount);

    debugger;

    // TODO: Build transaction, use core key manager
    this.coreKeyManagerService.signTransaction(<EthereumTransaction>{}).subscribe((transaction: EthereumTransaction) => {
      this.web3Service.sendRawTransaction(transaction);
    });
  }

}
