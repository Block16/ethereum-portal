import {Component, OnInit, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import {ThemeService} from "../../../core/theme.service";
import {Subscription} from "rxjs/Subscription";
import {Theme} from "../../model/theme/theme";

@Component({
  selector: 'transaction-dot',
  templateUrl: './transaction-dot.component.html',
  styleUrls: ['./transaction-dot.component.scss']
})
export class TransactionDotComponent implements OnDestroy {
  @Input() status = 'processing';
  public theme: Theme;
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
