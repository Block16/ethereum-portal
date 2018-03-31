import {Component, EventEmitter, Input, Output, OnInit} from '@angular/core';
import {DataShareService} from "../../../core/data-share.service";

@Component({
  selector: 'menu-button',
  templateUrl: './menu-button.component.html',
  styleUrls: ['./menu-button.component.scss']
})
export class MenuButtonComponent implements OnInit {
  @Input() static: boolean = false;
  @Input() value: boolean = false;
  @Output() valueChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  public theme: any;

  constructor(private dataShareService: DataShareService) {
    this.dataShareService.userPreferences.subscribe((value: any) => {
      this.theme = this.dataShareService.getTheme(value['theme']);
    });
  }

  click() {
    if (!this.static) {
      this.value = !this.value
      this.valueChange.emit(this.value);
    }
  }

  ngOnInit() {
  }

}
