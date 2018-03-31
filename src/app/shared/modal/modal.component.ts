import {Component, OnInit, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import {Subscription} from "rxjs/Subscription";
import {Theme} from "../model/theme/theme";
import {ThemeService} from "../../core/theme.service";

@Component({
  selector: 'modal',
  templateUrl: 'modal.component.html',
  styleUrls: ['modal.component.scss']
})
export class ModalComponent implements OnDestroy {
  @Input() closable = true;
  @Input() canCloseIf: any;
  @Input() visible: boolean;
  @Input() padding: boolean;
  @Input() maxWidth: string;
  @Input() title: string;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  public theme: Theme;
  private themeSubscription: Subscription;

  constructor(private themeService: ThemeService) {
    this.themeSubscription = this.themeService.theme.subscribe(theme => {
      this.theme = theme;
    });
  }

  close() {
    if (this.closable) {
      this.visible = false;
      this.visibleChange.emit(this.visible);
    }
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}
