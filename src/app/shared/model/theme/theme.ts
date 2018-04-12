
export interface Theme {
  name: string;
  
  primaryColor: string;
  primaryColorRgb: any;
  secondaryColor: string;
  secondaryColorRgb: any;
  accentColor: string;
  accentColorRgb: any;
  
  op1: number;
  op2: number;
  op3: number;
  op4: number;
  op5: number;
  
  isDark: boolean;
  
  mainStyle: any;
  primaryBackgroundStyle: any;
  secondaryBackgroundStyle: any;
  accentBackgroundStyle: any;
  
  overlayStyle: any;
  
  primaryTextStyle: any;
  secondaryTextStyle: any;
  accentTextStyle: any;
  
  buttonStyle: any;
  secondaryButtonStyle: any;
  accentButtonStyle: any;
  
  maxButtonOnStyle: any;
  maxButtonOffStyle: any;
  
  newTransactionTextStyle: any;
  
  primaryBorderStyle: any;
  secondaryBorderStyle: any;
  accentBorderStyle: any;
  
  toggleSwitchOffStyle: any;
  toggleSwitchOnStyle: any;
  
  textInputFocusStyle: any;
  textInputBlurStyle: any;
  
  selectOverlayStyle: any;
  selectArrowStyle: any;
  
  selectStyle: any;
  
  processingBackgroundStyle: any;
  confirmedBackgroundStyle: any;
  failedBackgroundStyle: any;
}
