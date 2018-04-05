
export interface Theme {
  name: string;
  
  primaryColor: string;
  primaryColorRgb: any;
  secondaryColor: string;
  secondaryColorRgb: any;
  accentColor: string;
  accentColorRgb: string;
  
  op1: number;
  op2: number;
  op3: number;
  op4: number;
  op5: number;
  
  isDark: boolean;
  
  mainStyle: any;
  backgroundStyle: any;
  primaryBackgroundStyle: any;
  accentBackgroundStyle: any;
  
  overlayStyle: any;
  
  textStyle: any;
  secondaryTextStyle: any;
  accentTextStyle: any;
  
  buttonStyle: any;
  secondaryButtonStyle: any;
  accentButtonStyle: any;
  
  newTransactionTextStyle: any;
  
  primaryBorderStyle: any;
  secondaryBorderStyle: any;
  accentBorderStyle: any;
  
  toggleSwitchOffStyle: any;
  toggleSwitchOnStyle: any;
  
  textInputFocusStyle: any;
  textInputBlurStyle: any;
  
  selectStyle: any;
  
  processingBackgroundStyle: any;
  confirmedBackgroundStyle: any;
  failedBackgroundStyle: any;
}
