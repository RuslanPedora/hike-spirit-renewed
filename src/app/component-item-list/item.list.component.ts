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
	//-----------------------------------------------------------------------------
	scrollImage( selectedItem: Item, forward: boolean ): void {
		let imageIndex = 0;
		let i: any;
		if( selectedItem.imageList.length <= 1 ) 
			return;
		
		imageIndex = selectedItem.imageList.findIndex( element => element.shift == 0 );
		if( forward && imageIndex == selectedItem.imageList.length  - 1 ) {
			for( i in selectedItem.imageList )
				selectedItem.imageList[ i ].shift = 100 * i;
		}
		else if ( !forward && imageIndex == 0 ) {
			for( i in selectedItem.imageList )
				selectedItem.imageList[ i ].shift = -100 * ( selectedItem.imageList.length - i - 1 );
		}
		else {
			for( i in selectedItem.imageList )  
				selectedItem.imageList[ i ].shift += forward ? -100 : 100 ;
		}
	}
	//-----------------------------------------------------------------------------
	gotoItem( selectedItem: Item ): void {
		this.router.navigate( [ '/item' ], { queryParams: { itemId: selectedItem.id } } );
	}
}