import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
<<<<<<< Updated upstream
export class AppComponent { }
=======
export class AppComponent {
	
	public defaultPreferences = {
		'manualGas': false,
		'showGenerated': true,
		'theme': 'Default',
		'denomination': 'None'
	}
	
	constructor(private dataShareService: DataShareService) {
		
	}
	
	public ngOnInit(): void {
		this.dataShareService.userPreferences.next(this.defaultPreferences);
		console.log(this.dataShareService.getUserPreferences());
	}
}
>>>>>>> Stashed changes
