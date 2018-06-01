import { Injectable } from '@angular/core';
import {UserPreferences} from "../shared/model/user-preferences";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Web3Service} from "./web3.service";
import {CoreKeyManagerService} from "./key-manager-services/core-key-manager.service";
import {Theme} from "../shared/model/theme/theme";
import {isNullOrUndefined} from "util";

@Injectable()
export class UserPreferencesService {

  static localPreferencesKey = "preferences";

  public userPreferences: BehaviorSubject<UserPreferences>;

  constructor(
  ) {
    let preferencesFromLocal = this.getPreferencesFromLocal();
    if (isNullOrUndefined(preferencesFromLocal)) {
      preferencesFromLocal = new UserPreferences(false, false, "None", "https://mainnet.infura.io", "Default");
    }
    this.userPreferences = new BehaviorSubject(preferencesFromLocal);
  }

  public setAdditionalDenomination(additionalDomination: string) {
    const preferences = this.userPreferences.value;
    preferences.additionalDenomination = additionalDomination;
    this.savePreferencesLocal(preferences);
  }

  public setTheme(theme: Theme) {
    const preferences = this.userPreferences.value;
    preferences.themeName = theme.name;
    this.savePreferencesLocal(preferences);
  }

  public setManualGas(manualGas: boolean) {
    const preferences = this.userPreferences.value;
    preferences.manualGas = manualGas;
    this.savePreferencesLocal(preferences);
  }

  public setProvider(provider: string) {
    const preferences = this.userPreferences.value;
    preferences.provider = provider;
    this.savePreferencesLocal(preferences);
  }

  public setShowGenerated(showGenerated: boolean) {
    const preferences = this.userPreferences.value;
    preferences.showGenerated = showGenerated;
    this.savePreferencesLocal(preferences);
  }

  private getPreferencesFromBlockchain() {

  }

  private getPreferencesFromLocal() {
    const prefs = localStorage.getItem(UserPreferencesService.localPreferencesKey);
    if (!isNullOrUndefined(prefs)) {
      return JSON.parse(prefs);
    }
    return null;
  }

  private savePreferencesLocal(preferences: UserPreferences) {
    localStorage.setItem(UserPreferencesService.localPreferencesKey, JSON.stringify(preferences));
    this.userPreferences.next(preferences);
  }

  public savePreferencesBlockchain() {

  }

}
