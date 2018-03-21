import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  public ethereumAddress: string;

  constructor() {
    this.ethereumAddress = "";
  }

  public ngOnInit(): void {

  }

  public onAddressChange(event) {
    this.ethereumAddress = event;
  }
}
