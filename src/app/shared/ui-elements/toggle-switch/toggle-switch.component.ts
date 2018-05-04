import {Component, EventEmitter, Input, Output, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from "rxjs/Subscription";
import {Theme} from "../../model/theme/theme";
import {ThemeService} from "../../../core/theme.service";

@Component({
  selector: 'toggle-switch',
  templateUrl: './toggle-switch.component.html',
  styleUrls: ['./toggle-switch.component.scss']
})
export class ToggleSwitchComponent implements OnDestroy {
  @Input() name: string;
  @Input() enabled = true;
  @Input() clickable = true;
  @Input() value: boolean;
  @Output() valueChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  public theme: Theme;
  public focus = false;

  private themeSubscription: Subscription;

  constructor(private themeService: ThemeService) {
    this.themeSubscription = this.themeService.theme.subscribe(theme => {
      this.theme = theme;
    });
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}
