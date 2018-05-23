import { AfterContentInit, Component, ElementRef, HostListener, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import {Subscription} from "rxjs/Subscription";
import {Theme} from "../model/theme/theme";
import {ThemeService} from "../../core/theme.service";

@Component({
  selector: 'app-receive',
  templateUrl: './receive.component.html',
  styleUrls: ['./receive.component.scss']
})
export class ReceiveComponent implements AfterContentInit, OnInit {
		
	@HostListener('window:resize', ['$event'])
	  onResize(event) {
	  	this.setQrSize();
  }
	@Input('address') address;
	
	@ViewChild('qrBox') _qrBox: ElementRef;
  
	public qrSize: string = null;
	public qrGridLength: number = 29;
	public qrArray = [];
	
	public theme: Theme;
	private themeSubscription: Subscription;
	
  constructor(private themeService: ThemeService) {
  	this.themeSubscription = this.themeService.theme.subscribe(theme => {
  	  this.theme = theme;
  	});
  }
  
  setQrSize() {
  	this.qrSize = this._qrBox.nativeElement.offsetWidth.toString();
  }
  
 	getRandomEntry(array) {
 		return array[Math.floor(Math.random() * array.length)];
 	}
  
  setOneToTrue(array) {
  	let falseIndices = [];
  	for (let i = 0; i < array.length; i++) {
  		if (array[i] == false) {
  			falseIndices.push(i);
  		}
  	}
  	array[this.getRandomEntry(falseIndices)] = true;
  }
  
  qrAnimation() {
  	for (let i = 0; i < this.qrGridLength; i++) {
  		this.setOneToTrue(this.qrArray[i]);
  	}
  }
  
  ngAfterContentInit() {
  	this.setQrSize();
  }
  
  ngOnChanges(changes: SimpleChanges) {
  	// debugger;
  }
  
  ngOnInit() {
  	let qrRow = [];
  	for (let i = 0; i < this.qrGridLength; i++) {
  		qrRow.push(false);
  	}
  	for (let i = 0; i < this.qrGridLength; i++) {
  		this.qrArray.push(qrRow);
  	}
		console.log(this.qrArray);
  	this.qrAnimation();
  	setTimeout(()=> {
  		// this.setQrSize();
  	},0)
  }

}
