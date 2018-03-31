<<<<<<< HEAD
import { Component, OnInit } from '@angular/core';
import { DataShareService } from "./core/data-share.service";
=======
import {Component, OnInit} from '@angular/core';
import {DataShareService} from "./core/data-share.service";
>>>>>>> master

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public defaultPreferences = {
    'manualGas': false,
    'showGenerated': true,
    'theme': 'Default',
    'denomination': 'None'
  }

  constructor(private dataShareService: DataShareService) {

  }

  public ngOnInit(): void {
    this.dataShareService.userPreferences.next(this.defaultPreferences);
    console.log(this.dataShareService.getUserPreferences());
  }
}
