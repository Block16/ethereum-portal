import { AfterViewChecked, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import {DataShareService} from "../../core/data-share.service";
import {Subscription} from "rxjs/Subscription";
import {Theme} from "../model/theme/theme";
import {ThemeService} from "../../core/theme.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  host: {
    '[style.background]': `this.theme.secondaryColor`
  }
})
export class NavbarComponent implements OnInit {

	@ViewChild('indicator') _indicator: ElementRef;
	@ViewChild('history') _history: ElementRef;
	@ViewChild('send') _send: ElementRef;
	@ViewChild('receive') _receive: ElementRef;
	
	public navLocation: string = 'receive';
	public theme: Theme;
	private themeSubscription: Subscription;
	private navIndicatorLeft: number = 79;
	private navIndicatorWidth: number = 75;
	
	@HostListener('window:resize', ['$event'])
	  onResize(event) {
	    this.moveNavIndicator(this.navLocation);
  }
	
	constructor(private themeService: ThemeService,
							private dataShareService: DataShareService) {
		

		this.dataShareService.navLocation.subscribe((value: any) => {
		  this.navLocation = value;
		  if (this._indicator) this.moveNavIndicator(value);
		});
    
	  this.themeSubscription = this.themeService.theme.subscribe(theme => {
	    this.theme = theme;
	  });
	}
	
	moveNavIndicator(location) {
		if (location == 'history') {
			this.navIndicatorLeft = this._history.nativeElement.getBoundingClientRect().left;
			this.navIndicatorWidth = this._history.nativeElement.getBoundingClientRect().width;
		} else if (location == 'send') {
			this.navIndicatorLeft = this._send.nativeElement.getBoundingClientRect().left;
			this.navIndicatorWidth = this._send.nativeElement.getBoundingClientRect().width;
		} else if (location == 'receive') {
			this.navIndicatorLeft = this._receive.nativeElement.getBoundingClientRect().left;
			this.navIndicatorWidth = this._receive.nativeElement.getBoundingClientRect().width;
		}
	}
	
	setNavLocation(location) {
		this.dataShareService.navLocation.next(location);
	}
	
	ngAfterViewChecked() {
  	  // this.moveNavIndicator(this.navLocation);
	}
	
  ngOnInit() {
  	
  }

}
