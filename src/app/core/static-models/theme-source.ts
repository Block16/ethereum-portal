const defaultValues = {
  op1: .05,
  op2: .1,
  op3: .2,
  op4: .4,
  backgroundColor: '#EFF1F2',
  black: '#000000',
  yellow: '#f6eb0f',
  green: '#00CF34',
  red: '#ED466E',
};


export interface ThemeSource {
  name: string;
  backgroundColor: string;
  primaryColor: string;
  processingColor: string;
  confirmedColor: string;
  failedColor: string;
  op1: number;
  op2: number;
  op3: number;
  op4: number;
}


const ThemeSources: ThemeSource[] = [
  <ThemeSource> {
    'name': 'Default',
    'primaryColor': defaultValues.black,
    'backgroundColor': defaultValues.backgroundColor,
    'processingColor': defaultValues.yellow,
    'failedColor': defaultValues.red,
    'confirmedColor': defaultValues.green,
    'op1': defaultValues.op1,
    'op2': defaultValues.op2,
    'op3': defaultValues.op3,
    'op4': defaultValues.op4
  },
  <ThemeSource> {
    'name': 'Dark',
    'primaryColor': defaultValues.backgroundColor,
    'backgroundColor': defaultValues.black,
    'processingColor': defaultValues.yellow,
    'failedColor': defaultValues.red,
    'confirmedColor': defaultValues.green,
    'op1': defaultValues.op1,
    'op2': defaultValues.op2,
    'op3': defaultValues.op3,
    'op4': defaultValues.op4
  }
];

export {ThemeSources};
