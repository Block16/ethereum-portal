import { Component, OnInit } from '@angular/core';
import {Subscription} from "rxjs/Subscription";
import {ThemeService} from "../../core/theme.service";
import {Theme} from "../../shared/model/theme/theme";

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent implements OnInit {
	
	public transactions = [];
  public theme: Theme;
  private themeSubscription: Subscription;
	
  constructor(private themeService: ThemeService) {
    this.themeSubscription = this.themeService.theme.subscribe(theme => {
      this.theme = theme;
    });
  }

  
  randomTransaction() {
    const addresses = [
      '0x2a65Aca4D5fC5B5C859090a6c34d164135398226',
      '0x9034C5691E4CF92507E79a5A29D8e162b9506cD9',
      '0x4Cd988AfBad37289BAAf53C13e98E2BD46aAEa8c',
      '0xf73C3c65bde10BF26c2E1763104e609A41702EFE',
      '0x8d12A197cB00D4747a1fe03395095ce2A5CC6819',
      '0x4781BEe730C9056414D86cE9411a8fb7FF02219f',
      '0x2ddb2555c3C7Ad23991125CAa4775E19b93204b9'
    ];
    const toAddress = addresses[Math.floor(Math.random() * addresses.length)];
    const fromAddress = addresses[Math.floor(Math.random() * addresses.length)];
    const statuses = ['processing', 'confirmed', 'failed'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const kind = ['to', 'from'][Math.floor(Math.random() * 2)];
    let confirmations = 0;
    if (status == 'confirmed') {
      confirmations = Math.floor(Math.random() * 20);
    }
    const assets = ['ETH', 'SPHTX', 'WETH', 'UKG', 'THETA', 'ZRX', 'CS', 'MAN', 'REM'];
    const asset = assets[Math.floor(Math.random() * assets.length)];
    const amount = Math.floor(Math.random() * 1000000);
    return {
      'toAddress': toAddress,
      'fromAddress': fromAddress,
      'status': status,
      'kind': kind,
      'confirmations': confirmations,
      'asset': asset,
      'amount': amount,
      'created': new Date()
    };
  }
  
  ngOnInit() {
  	for (var i = 0; i < 12; i++) {
  		this.transactions.push(this.randomTransaction());
  	}
  }

}
