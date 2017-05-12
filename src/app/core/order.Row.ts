import { Item } from 'hs_core/item';

export class OrderRow {
	item: Item;
	quantity: number;	
	total: number;
	constructor( item: Item ) {
		this.item     = item;
		this.quantity = 1;
		this.total    = this.quantity * this.item.discountPrice;
	}	
}

