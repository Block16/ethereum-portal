import {Component, EventEmitter, Input, Output, OnDestroy} from '@angular/core';
import {ThemeService} from "../../../core/theme.service";
import {Subscription} from "rxjs/Subscription";
import {Theme} from "../../model/theme/theme";

@Component({
  selector: 'menu-button',
  templateUrl: './menu-button.component.html',
  styleUrls: ['./menu-button.component.scss']
})
export class MenuButtonComponent implements OnDestroy {
  @Input() static = false;
  @Input() value = false;
  @Input() inverse = false;
  @Output() valueChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  public theme: Theme;
  private themeSubscription: Subscription;

  constructor(private themeService: ThemeService) {
    this.themeSubscription = this.themeService.theme.subscribe(theme => {
      this.theme = theme;
    });
  }

  click() {
    if (!this.static) {
      this.value = !this.value;
      this.valueChange.emit(this.value);
    }
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}
