import {isNullOrUndefined} from "util";

export class Notification {
  constructor (
    readonly text: string,
    readonly title?: string,
    readonly duration?: number) {
    
    if (isNullOrUndefined(duration)) {
	  	// duration in seconds. 0 == infinite
      this.duration = 5;
    }
    
  }
}
