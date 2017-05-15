import { Component, 
	     OnInit }       from '@angular/core';
import { Router }       from '@angular/router';

import { DataService } from 'hs_services/data.service';

import { Item } from 'hs_core/item';

@Component({
	moduleId: module.id,
	selector: 'compare-items',
	templateUrl: './compare.component.html',
	styleUrls: [ './compare.component.css' ],
})
//-----------------------------------------------------------------------------
export class CompareItems implements OnInit {
	private compareItems: Item[] = [];
	//-----------------------------------------------------------------------------
	constructor( private router: Router,
				 private dataService: DataService ) {
	}
	//-----------------------------------------------------------------------------
	ngOnInit() {
		this.compareItems = this.dataService.getCompareList();
	}
	//-----------------------------------------------------------------------------
	gotoItem( selectedItem: Item ) {
		this.router.navigate( [ '/item' ], { queryParams: { itemId: selectedItem.id } } );
	}
	//-----------------------------------------------------------------------------
}