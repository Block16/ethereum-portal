import { Component, OnInit } from '@angular/core';
import { DataShareService } from "../../core/data-share.service";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  public theme;
  public ethereumAddress: string;
  private userPreferences;

  constructor(private dataShareService: DataShareService) {
    this.ethereumAddress = "";
    this.dataShareService.userPreferences.subscribe((value: any) => {
      this.userPreferences = value;
      this.theme = this.dataShareService.getTheme(value['theme']);
    });
  }

  public ngOnInit(): void {
    
  }

  public onAddressChange(event) {
    this.ethereumAddress = event;
  }
}
