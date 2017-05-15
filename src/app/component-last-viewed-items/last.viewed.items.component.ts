import { Component, 
	     OnInit }       from '@angular/core';
import { Router }       from '@angular/router';

import { DataService } from 'hs_services/data.service';

import { Item } from 'hs_core/item';

@Component({
	moduleId: module.id,
	selector: 'last-viewed-items',
	templateUrl: './last.viewed.items.component.html',
	styleUrls: [ './last.viewed.items.component.css' ],
})
//-----------------------------------------------------------------------------
export class LastViewedItems implements OnInit {
	private lastViewedItems: Item[] = [];
	//-----------------------------------------------------------------------------
	constructor( private router: Router,
				 private dataService: DataService ) {
	}
	//-----------------------------------------------------------------------------
	ngOnInit() {
		this.lastViewedItems = this.dataService.getLastViewedItems();
	}
	//-----------------------------------------------------------------------------
	gotoItem( selectedItem: Item ) {
		this.router.navigate( [ '/item' ], { queryParams: { itemId: selectedItem.id } } );
	}
	//-----------------------------------------------------------------------------
}