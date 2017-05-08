import { Component, 
	     OnInit }       from '@angular/core';
import { Router }       from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

//import { DataService }  from 'services/data.service';

@Component({
	moduleId: module.id,
	selector: 'app-component',
	templateUrl: './app.component.html',
	styleUrls: [ './app.component.css' ],
	host: {
	    '(window:resize)': 'onResize($event)'
  	}	
})
//-----------------------------------------------------------------------------
export class ApplicationComponent implements OnInit {
	//-----------------------------------------------------------------------------
	constructor() {
	}
	//-----------------------------------------------------------------------------
	ngOnInit() {
	}
	//-----------------------------------------------------------------------------
	onResize( event: any ){
   	}
}