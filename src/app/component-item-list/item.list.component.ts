import { Component, 
	     OnInit }         from '@angular/core';
import { Router,
		 ActivatedRoute } from '@angular/router';

import { DataService }    from 'hs_services/data.service';

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
	sotringKey: string = '';
	//-----------------------------------------------------------------------------
	constructor(private router: Router,
				private activatedRoute: ActivatedRoute,
				private dataService: DataService) {
	}
	//-----------------------------------------------------------------------------
	ngOnInit() {
		this.activatedRoute.queryParams.subscribe(queryParams => this.getItemList(queryParams));		
		window.scrollTo(0, 0);
	}
	//-----------------------------------------------------------------------------
	getItemList(params: any): void {
		let queryString: string = '';

		for (let paramName in params) {
			queryString += queryString === '' ? '' : '&';
			if (params[ paramName ] instanceof Array) {
				queryString += params[ paramName ].map((el: any) => `${paramName}=${el}`).join('&');
			} else {
				queryString += `${paramName}=${params[paramName]}`;
			}
		}

		this.dataService.getItemList(queryString).then(itemList => { 
			this.itemList = itemList;
			this.dataService.converRate(this.itemList);
			if (this.sotringKey) {
				this.sortItemList(this.sotringKey);
			}
		});
	}
	//-----------------------------------------------------------------------------
	scrollImage(selectedItem: Item, forward: boolean): void {
		let imageIndex = 0;
		let i: any;

		if (selectedItem.imageList.length <= 1) {
			return;
		}	
		
		imageIndex = selectedItem.imageList.findIndex(element => element.shift == 0);
		if (forward && imageIndex == selectedItem.imageList.length  - 1) {
			for (i in selectedItem.imageList)
				selectedItem.imageList[ i ].shift = 100 * i;
		} else if (!forward && imageIndex == 0) {
			for (i in selectedItem.imageList)
				selectedItem.imageList[ i ].shift = -100 * (selectedItem.imageList.length - i - 1);
		} else {
			for (i in selectedItem.imageList)  
				selectedItem.imageList[ i ].shift += forward ? -100 : 100 ;
		}
	}
	//-----------------------------------------------------------------------------
	gotoItem(selectedItem: Item): void {
		this.router.navigate([ '/item' ], { queryParams: { id: selectedItem.id } });
	}
	//-----------------------------------------------------------------------------
	buyItem(selectedItem: Item): void {
		this.dataService.addItemToBasket(selectedItem);
	}
	//-----------------------------------------------------------------------------
	sortItemList(sortKey: string): void {
		this.sotringKey = sortKey;
		this.itemList.sort(this[ sortKey ]);
	}
	//-----------------------------------------------------------------------------
	nameUp(a: Item, b: Item): number {
		return (a.name < b.name ? -1 : 1);
	}
	//-----------------------------------------------------------------------------
	nameDown(a: Item, b: Item): number {
		return (a.name > b.name ? -1 : 1);
	}
	//-----------------------------------------------------------------------------
	priceUp(a: Item, b: Item): number {
		return (a.discountPrice < b.discountPrice ? -1 : 1);
	}
	//-----------------------------------------------------------------------------
	priceDown(a: Item, b: Item): number {
		return (a.discountPrice > b.discountPrice ? -1 : 1);
	}
	//-----------------------------------------------------------------------------
	rateUp(a: Item, b: Item): number {
		return (a.rate < b.rate ? -1 : 1);
	}
	//-----------------------------------------------------------------------------
	rateDown(a: Item, b: Item): number {
		return (a.rate > b.rate ? -1 : 1);
	}
	//-----------------------------------------------------------------------------
}