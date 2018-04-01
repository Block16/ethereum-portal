import {Component, Input, OnInit, Output, OnDestroy} from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  host: {
    tabindex: '0'
  }
})
export class ButtonComponent implements OnInit {
	
	@Input() kind: string;
	
  constructor() { }

  ngOnInit() {
  }

}
