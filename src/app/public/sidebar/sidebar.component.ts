import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs/Subscription";
import {Web3Service} from "../../core/web3.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public showMenu = false;
  public address: string;

  @Input() set account(address: string) {
    this.address = address;
    console.log(this.address);
    if (this.address !== "") {

    }
  }

  constructor(
    private web3Service: Web3Service
  ) {
    this.address = "";
  }

  public ngOnInit(): void {
  }
}
