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
		if( selectedItem.imageList.length == 0 ) 
			return;
		imageIndex = selectedItem.imageList.findIndex( element => element.mediumImage == selectedItem.mainImage );
		if( imageIndex < 0 )
			selectedItem.mainImage = selectedItem.imageList[ 0 ].mediumImage;
		else {
			 if ( forward ) {
				imageIndex = ( imageIndex + 1 == selectedItem.imageList.length ? 0 : imageIndex + 1 );
			 }
			 else {
				imageIndex = ( imageIndex - 1 < 0 ? selectedItem.imageList.length - 1 : imageIndex - 1 );
			 }
  		     selectedItem.mainImage = selectedItem.imageList[ imageIndex ].mediumImage;
		}	 
	}
	//-----------------------------------------------------------------------------
}