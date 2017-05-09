import { Component, 
	     OnInit }       from '@angular/core';
import { Router }       from '@angular/router';

@Component({
	moduleId: module.id,
	selector: 'basket-component',
	templateUrl: './basket.component.html',
	styleUrls: [ './basket.component.css' ],
})
//-----------------------------------------------------------------------------
export class BasketComponent implements OnInit {
	//-----------------------------------------------------------------------------
	constructor( private router: Router ) {
	}
	//-----------------------------------------------------------------------------
	ngOnInit() {
	}
}