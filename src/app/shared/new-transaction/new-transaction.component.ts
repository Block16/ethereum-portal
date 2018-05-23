import { AfterContentInit, AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import {DataShareService} from "../../core/data-share.service";
import {Subscription} from "rxjs/Subscription";
import {ThemeService} from "../../core/theme.service";
import {Theme} from "../../shared/model/theme/theme";
import {Block16Service} from "../../core/block16.service";

@Component({
  selector: 'app-new-transaction',
  templateUrl: './new-transaction.component.html',
  styleUrls: ['./new-transaction.component.scss']
})
export class NewTransactionComponent implements AfterContentInit, AfterViewInit, OnChanges, OnInit {
  private themeSubscription: Subscription;
  public theme: Theme;
		
	public windowWidth: number;
	public windowHeight: number;
	
	public initialCircleDiameter: string;
	public showFixedCircle: boolean = false;
	public hidingFixedCircle: boolean = false;
	public fixedCircleStyle = {};
	public circleTransitionTime = .5;
	public circleTransitionTimeString = this.circleTransitionTime + 's';
  
	@ViewChild('fixed') _fixed: ElementRef;
	
	@Input('mode') mode;
	@Input('transaction') transaction;
  @Input('userPreferences') userPreferences;
	@Input('newTxStyle') newTxStyle;
	@Input('newTxCircleStyle') newTxCircleStyle;
	@Input('small') small;
	@Input('currentAuth') currentAuth;
	@Input('absoluteCircleInfo') absoluteCircleInfo;
	
	@Output() setMode: EventEmitter<string> = new EventEmitter<string>();
	
	@HostListener('window:resize', ['$event'])
	onResize(event) {
		this.windowWidth = window.innerWidth;
		this.windowHeight = window.innerHeight;
		if (this.mode == 'approve') {
			this.callibrateFixedCircle();
		}
	}
	
  constructor(private themeService: ThemeService,
					    private assetService: Block16Service,
							private dataShareService: DataShareService) {
  	this.themeSubscription = this.themeService.theme.subscribe(theme => {
  	  this.theme = theme;
  	});
  	
  	
  	// this.assetSubscription = this.assetService.ethereumAssets.subscribe(assets => {
  	// 	console.log('asset subscription triggered')
  	// 	this.callibrateCircles();
  	// });
  }
  
  callibrateFixedCircle() {
  	// this repositions the fixed circle prior to fullscreening  	
  	
  	this.fixedCircleStyle['transition'] = '0s';
  	if (this.mode == 'initial') {
	    this.fixedCircleStyle['width'] = this.absoluteCircleInfo.width;
	    this.fixedCircleStyle['height'] = this.absoluteCircleInfo.height;
	    this.fixedCircleStyle['left'] = this.absoluteCircleInfo.totalOffsetLeft + 'px';
	    this.fixedCircleStyle['top'] = this.absoluteCircleInfo.totalOffsetTop + 'px';
  	} else if (this.mode == 'approve') {
	  	const r = this.fullscreenCircleRadius();
	    const fixedCircleLeftOffset = (r - this.windowWidth / 2) * -1;
	    const fixedCircleTopOffset = (r - this.windowHeight / 2) * -1;
	    
	  	this.fixedCircleStyle['transition'] = this.circleTransitionTimeString;
	  	this.fixedCircleStyle['width'] = r * 2 + 'px';
	  	this.fixedCircleStyle['height'] = r * 2 + 'px';
	  	this.fixedCircleStyle['left'] = fixedCircleLeftOffset + 'px';
	  	this.fixedCircleStyle['top'] = fixedCircleTopOffset + 'px';
	  	
	  	setTimeout(()=>{
	  	 },0);
  	}
  }
  
  fullscreenCircleRadius() {
  	const r = Math.sqrt(
    	Math.pow(
    		Math.max(this.windowWidth, this.windowHeight) / 2, 2
    	) + 
    	Math.pow(
    		Math.min(this.windowWidth, this.windowHeight) / 2, 2
    	)
    );
    console.log(r);
    return r;
  }
  
  cancelTx() {
  	this.setMode.emit('initial');
  }
  
  submitTx() {
  	this.dataShareService.navLocation.next('history');
    this.showFixedCircle = false;
  }
  
  cancelCircleFullscreen() {
  	this.fixedCircleStyle['transition'] = this.circleTransitionTimeString;
  	const contentOffsetLeft = this.absoluteCircleInfo.totalOffsetLeft;
  	const contentOffsetTop = this.absoluteCircleInfo.totalOffsetTop;
  	// debugger;
    this.fixedCircleStyle['width'] = this.absoluteCircleInfo.width + 'px';
    this.fixedCircleStyle['height'] = this.absoluteCircleInfo.height + 'px';
    this.fixedCircleStyle['left'] = this.absoluteCircleInfo.totalOffsetLeft + 'px';
    this.fixedCircleStyle['top'] = this.absoluteCircleInfo.totalOffsetTop + 'px';
    this.hidingFixedCircle = true;
  	setTimeout(()=>{
  		this.showFixedCircle = false;
	    this.hidingFixedCircle = false;
  	 },this.circleTransitionTime * 1000);
  }
  
  setCircleToFullscreen() {
  	const r = this.fullscreenCircleRadius();
    const fixedCircleLeftOffset = (r - this.windowWidth / 2) * -1;
    const fixedCircleTopOffset = (r - this.windowHeight / 2) * -1;
		this.fixedCircleStyle['width'] = this.absoluteCircleInfo.width + 'px';
		this.fixedCircleStyle['height'] = this.absoluteCircleInfo.height + 'px';
  	this.fixedCircleStyle['left'] = this.absoluteCircleInfo.totalOffsetLeft + 'px';
  	this.fixedCircleStyle['top'] = this.absoluteCircleInfo.totalOffsetTop + 'px';
  	// debugger;
  	console.log(this.absoluteCircleInfo);
  	this.showFixedCircle = true;
  	this.fixedCircleStyle['transition'] = this.circleTransitionTimeString;
  	
  	setTimeout(()=>{
	  	this.fixedCircleStyle['width'] = r * 2 + 'px';
	  	this.fixedCircleStyle['height'] = r * 2 + 'px';
	  	this.fixedCircleStyle['left'] = fixedCircleLeftOffset + 'px';
	  	this.fixedCircleStyle['top'] = fixedCircleTopOffset + 'px';
  	 },0);
  	console.log('circle full')
  }
  
  setCircleToTxHistory() {
  	console.log('setCircleToTxHistory()');
  	// this.
  	this.dataShareService.navLocation.next('history');
  }
  
  

  
  setCircle(modeChanges) {
  	if (modeChanges.currentValue == 'initial') {
  		if (modeChanges.previousValue == 'approve') {
  			this.cancelCircleFullscreen();
  		} else {
  			this.callibrateFixedCircle();
  		}
  	} else if (modeChanges.currentValue == 'approve') {
  		this.setCircleToFullscreen();
  	} else if (modeChanges.currentValue == 'send') {
  		this.setCircleToTxHistory();
  	}
  }
  
  
  ngOnChanges(changes: SimpleChanges){
    if (changes.mode && this.absoluteCircleInfo) {
	  	console.log(changes.mode.currentValue);
	  	this.setCircle(changes.mode);
    }
    if (changes.absoluteCircleInfo && changes.absoluteCircleInfo.currentValue) {
	  	// this.setCircle(changes.mode);
    	// this.absoluteCircleInfo = changes.absoluteCircleInfo.currentValue;
    }
  }
  
  ngAfterViewInit() {
	  // console.log('vvvvvvv VIEW INIT');
  	// this.callibrateCircles();
	  // console.log('^^^^^^^');
		this.windowWidth = window.innerWidth;
		this.windowHeight = window.innerHeight;
  }
	ngAfterContentInit() {
	  // console.log('vvvvvvv CONTENT INIT');
  	// this.callibrateCircles();
	  // console.log('^^^^^^^');
	}; 
  
  ngOnInit() {
  }

}
