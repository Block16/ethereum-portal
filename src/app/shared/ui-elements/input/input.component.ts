import { Attribute, Component, ChangeDetectorRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import {Subscription} from "rxjs/Subscription";
import {ThemeService} from "../../../core/theme.service";
import {Theme} from "../../model/theme/theme";

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {
  @ViewChild('label') _label;
  @Input() value: string;
  @Input() control: FormControl;
  @Input() inputID: string;
  @Input() inputName: string;
  @Input() inputPlaceholder: string;
  @Input() type: string;

  public theme: Theme;
  public focus = false;
  public showLabel = false;

  private themeSubscription: Subscription;

  constructor(@Attribute('new-tx') private newTx: boolean | null,
              private themeService: ThemeService,
              private cdRef: ChangeDetectorRef) {
    this.newTx = (newTx != null);
    this.themeSubscription = this.themeService.theme.subscribe(theme => {
      this.theme = theme;
    });
  }

  ngAfterViewInit() {
    this.showLabel = this._label.nativeElement && this._label.nativeElement.children.length > 0;
    this.cdRef.detectChanges();
  }

  ngOnInit() {

  }

}
