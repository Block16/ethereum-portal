import {Attribute, Component, HostBinding, HostListener, Input, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from "rxjs/Subscription";
import {ThemeService} from "../../../core/theme.service";
import {Theme} from "../../model/theme/theme";

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  host: {
    'tabindex': '0',
    'role': 'button',
    '[class.accent]': 'this.accent',
    '[class.disabled]': 'this.disabled',
    '[style.background]': `this.accent ?
                           this.theme.accentColor :
                             this.secondary ? 
                             this.theme.secondaryColor :
                               this.newTx ? 
                               this.theme.newTxColor :
                                 this.theme.primaryColor`,
    '[style.color]': `this.secondary ? 
                      this.theme.primaryColor :
                        this.newTx ?
                        this.theme.pricessingColor :
                        this.theme.secondaryColor`
  }
})
export class ButtonComponent implements OnDestroy {
  @Input() kind: string;
  @Input('disabled') disabled = false;

  public theme: Theme;
  public hover = false;

  private themeSubscription: Subscription;

  constructor(
    @Attribute('size') public size: string = 'normal',
    @Attribute('accent') public accent: boolean | null,
    @Attribute('secondary') public secondary: boolean | null,
    @Attribute('small') public small: boolean | null,
    @Attribute('submit') public submit: boolean | null,
    @Attribute('new-tx') public newTx: boolean | null,
    private themeService: ThemeService
  ) {
    this.accent = (accent != null);
    this.small = (small != null);
    this.secondary = (secondary != null);
    this.newTx = (submit != null);
    this.submit = (submit != null);
    this.themeSubscription = this.themeService.theme.subscribe(theme => {
      this.theme = theme;
    });
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }

  spacebar() {
    console.log('pressed space on focused element');
  }

  onFocus() {

  }

  onBlur() {

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
