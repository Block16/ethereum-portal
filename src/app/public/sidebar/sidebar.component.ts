import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs/Subscription";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
	// preferences
	public manualGas: boolean = false;
	public viewGenerated: boolean = false;
	public darkMode: boolean = false;
	
  public showMenu: boolean = false;

  ngOnInit() {
  }
}
