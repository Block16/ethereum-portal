import { Component } from '@angular/core';
import {UserPreferencesService} from "./core/user-preferences.service";
import {TokenSymbolService} from "./core/token-symbol.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private userPreferencesService: UserPreferencesService
  ) {

  }
}
