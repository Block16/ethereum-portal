import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { DataShareService } from "../../../core/data-share.service";

@Component({
  selector: 'toggle-switch',
  templateUrl: './toggle-switch.component.html',
  styleUrls: ['./toggle-switch.component.scss']
})
export class ToggleSwitchComponent implements OnInit {
  @Input() enabled: boolean = true;
  @Input() clickable: boolean = true;
  @Input() value: string;
  @Output() valueChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private dataShareService: DataShareService) {
    this.dataShareService.userPreferences.subscribe((value: any) => {
      this.theme = this.dataShareService.getTheme(value['theme']);
    });
  }

  click() {
  	if (this.enabled && this.clickable) {
  		this.value = !this.value;
  		this.valueChange.emit(this.value);
  	}
  }
  
  ngOnInit() {
  }

}
