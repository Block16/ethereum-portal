import {BehaviorSubject} from 'rxjs/BehaviorSubject';

export interface ListWidths {
  asset: string;
  block: string;
  time: string;
}

export class TransactionService {
  public widestWidths = new BehaviorSubject({
    'asset': '10em',
    'block': '8em',
    'time': '10em'
  });
  public widestWidthStyles = new BehaviorSubject({
    'entryStyle': {},
    'assetStyle': {},
    'blockStyle': {},
    'timeStyle': {}
  });
  // public widestAsset = new BehaviorSubject('10em');
  // public widestTime = new BehaviorSubject('10em');
  constructor() { }
}
