
export class Theme {
  constructor(
    readonly mainStyle: MainStyle,
    readonly backgroundStyle: any,
    readonly primaryBackgroundStyle: any,
    readonly textStyle: any,
    readonly buttonStyle: any,
    readonly toggleSwitchOffStyle: any,
    readonly toggleSwitchOnStyle: any,
    readonly selectStyle: any,
    readonly processingBackgroundStyle: any,
    readonly confirmedBackgroundStyle: any,
    readonly failedBackgroundStyle: any
  ) {

  }
}

export interface MainStyle {

}
