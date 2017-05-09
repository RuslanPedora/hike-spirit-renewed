import { Component, 
	     OnInit }       from '@angular/core';
import { Router }       from '@angular/router';

import { DataService } from 'hs_services/data.service';

import { Item }     from 'hs_core/item';
import { Image }    from 'hs_core/image';


@Component({
	moduleId: module.id,
	selector: 'item-list-component',
	templateUrl: './item.list.component.html',
	styleUrls: [ './item.list.component.css' ],
})
//-----------------------------------------------------------------------------
export class ItemListComponent implements OnInit {
	itemList: Item[] = [];
	//-----------------------------------------------------------------------------
	constructor( private router: Router,
				 private dataService: DataService ) {
	}
	//-----------------------------------------------------------------------------
	ngOnInit() {
		this.dataService.getItemList( '' ).then( itemList => { this.itemList = itemList;
			                                                   this.dataService.converRate( this.itemList );
		} );
	}
}