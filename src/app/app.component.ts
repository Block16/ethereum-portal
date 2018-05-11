import { Component } from '@angular/core';
import {UserPreferencesService} from "./core/user-preferences.service";
import {BigNumber} from 'bignumber.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private userPreferencesService: UserPreferencesService,
  ) {
    BigNumber.config({ EXPONENTIAL_AT: [-21, 40] });
  }
}
