import {Component, HostListener, Input, OnInit} from '@angular/core';
import {Subscription} from "rxjs/Subscription";
import {ThemeService} from "../../../core/theme.service";
import {Theme} from "../../model/theme/theme";

@Component({
  selector: 'app-toggle-section',
  templateUrl: './toggle-section.component.html',
  styleUrls: ['./toggle-section.component.scss'],
  host: {
    '[class.hover]': "this.hover",
    '[class.focus]': "this.focus"
  }
})
export class ToggleSectionComponent {

  @Input() title: string;
  @Input() open = false;

  @HostListener('mouseover')
  onMouseOver() {
    this.hover = true;
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.hover = false;
  }

  public hover = false;
  public focus = false;
  public theme: Theme;

  private themeSubscription: Subscription;

  constructor(private themeService: ThemeService) {
    this.themeSubscription = this.themeService.theme.subscribe(theme => {
      this.theme = theme;
    });
  }
}
