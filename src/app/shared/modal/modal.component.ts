import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'modal',
  templateUrl: 'modal.component.html',
  styleUrls: ['modal.component.scss']
})
export class ModalComponent implements OnInit {
  @Input() closable = true;
  @Input() canCloseIf: any;
  @Input() visible: boolean;
  @Input() padding: boolean;
  @Input() maxWidth: string;
  @Input() title: string;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {
  }

  close() {
  	if (this.closable) {
  		this.visible = false;
  		this.visibleChange.emit(this.visible);
  		console.log(this.visible);
  	}
  }

  ngOnInit() {
  }

}
