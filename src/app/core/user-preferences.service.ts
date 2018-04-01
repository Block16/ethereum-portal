import { Injectable } from '@angular/core';
import {UserPreferences} from "../shared/model/user-preferences";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Injectable()
export class UserPreferencesService {

  public userPreferences: BehaviorSubject<UserPreferences>;

  constructor() {
    // TODO: try to load preferences from the localstorage first
    this.userPreferences = new BehaviorSubject(<UserPreferences>{ manualGas: false, showGenerated: false });
  }

  public setPreferences(userPref: UserPreferences) {
    this.userPreferences.next(userPref);
  }

  private getPreferencesFromLocal() {

  }

  private getPreferencesFromBlockchain() {

  }

  public savePreferencesLocal() {

  }

  public savePreferencesBlockchain() {

  }

}
