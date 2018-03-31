import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {DataShareService} from "../../core/data-share.service";

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
  public theme: any;

  constructor(private dataShareService: DataShareService) {
    this.dataShareService.userPreferences.subscribe((value: any) => {
      this.theme = this.dataShareService.getTheme(value['theme']);
    });
  }

  close() {
    if (this.closable) {
      this.visible = false;
      this.visibleChange.emit(this.visible);
    }
  }

  ngOnInit() {
  }

}
