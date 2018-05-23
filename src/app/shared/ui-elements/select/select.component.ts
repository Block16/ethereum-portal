import {Attribute, Component, HostListener, Input, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Subscription} from "rxjs/Subscription";
import {ThemeService} from "../../../core/theme.service";
import {Theme} from "../../model/theme/theme";
import {isNullOrUndefined} from "util";

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  host: {
    '[class.small]': "this.small",
    '[class.hover]': "this.hover",
    '[class.focus]': "this.focus",
    '[style.background]': `this.newTx ? 
                           this.theme.newTxColorOp2 :
                           this.theme.primaryColorOp2`
  }
})
export class SelectComponent implements OnInit, OnDestroy {
  @Input() control: FormControl;
  @Input() options: Theme[];
  @Input() optionProperty: string;
  @Input() placeholder: string;
  @Input() initialValue: any;

  public hover = false;
  public focus = false;
  public theme: Theme;

  private themeSubscription: Subscription;

  constructor(
    @Attribute('small') private small: boolean | null,
    @Attribute('new-tx') private newTx: boolean | null,
    private themeService: ThemeService
  ) {
    this.small = (small != null);
    this.newTx = (newTx != null);

    this.themeSubscription = this.themeService.theme.subscribe(theme => {
      this.theme = theme;
    });
  }

  ngOnInit() {
    if (!isNullOrUndefined(this.initialValue)) {
      this.control.setValue(this.initialValue, {onlySelf: true});
    }
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }

  @HostListener('mouseover')
  onMouseOver() {
    this.hover = true;
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.hover = false;
  }
}
