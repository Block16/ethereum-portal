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
      this.theme.primaryColor`,
    '[style.color]': `this.theme.secondaryColor`
  }
})
export class ButtonComponent implements OnInit {
  @Input() kind: string;
  @Input('disabled') disabled = false;

  public theme: Theme;
  public hover = false;

  private themeSubscription: Subscription;

  constructor(
    @Attribute('size') public size: string = 'normal',
    @Attribute('accent') public accent: boolean | null,
    @Attribute('small') public small: boolean | null,
    @Attribute('submit') public submit: boolean | null,
    private themeService: ThemeService
  ) {
    this.accent = (accent != null);
    this.small = (small != null);
    this.submit = (submit != null);
    this.themeSubscription = this.themeService.theme.subscribe(theme => {
      this.theme = theme;
    });
  }

  spacebar() {
    console.log('pressed space on focused element');
  }

  ngOnInit() {
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
