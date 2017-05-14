import { Component, 
	     OnInit }       from '@angular/core';
import { Router }       from '@angular/router';

import { DataService } from 'hs_services/data.service';

import { Item }     from 'hs_core/item';
import { OrderRow } from 'hs_core/order.row';
import { Carrier }  from 'hs_core/carrier';

@Component({
	moduleId: module.id,
	selector: 'basket-component',
	templateUrl: './basket.component.html',
	styleUrls: [ './basket.component.css' ],
})
//-----------------------------------------------------------------------------
export class BasketComponent implements OnInit {
	private orderRows: OrderRow[] = [];
	private carrierList: Carrier[] = [];
	private total: number = 0;	
	private totalPlusShipment: number = 0;	
	private selectedCarrier: Carrier = new Carrier();
	private paymentType: string = 'card';
	//-----------------------------------------------------------------------------
	constructor( private router: Router, 
		         private dataService: DataService ) {
	}
	//-----------------------------------------------------------------------------
	ngOnInit() {
		this.orderRows = this.dataService.getBasketRows();
		this.total     = this.dataService.getBasketTotal();
		this.totalPlusShipment = this.total + this.selectedCarrier.cost;
		this.dataService.getCarrierList().then( carrierList => { 
			this.carrierList = carrierList;
			if( this.carrierList.length > 0 ) this.selectedCarrier = this.carrierList[ 0 ];
			this.totalPlusShipment = this.total + this.selectedCarrier.cost;
		} );
	}
	//-----------------------------------------------------------------------------
	selectCarrier( carrier: Carrier ): void {
		this.selectedCarrier = carrier;
		this.totalPlusShipment = this.total + this.selectedCarrier.cost;
	}
	//-----------------------------------------------------------------------------
	addItem( item: Item, fixedQuiantity?: number ): void {

		if( fixedQuiantity == undefined )
			this.dataService.addItemToBasket( item );
		else	
			this.dataService.addItemToBasket( item, fixedQuiantity );
		this.total = this.dataService.getBasketTotal();
		this.totalPlusShipment = this.total + this.selectedCarrier.cost;
		this.orderRows = this.dataService.getBasketRows();
	}
	//-----------------------------------------------------------------------------
	deleteItem( item: Item ): void {
		this.dataService.deleteItemToBasket( item );
		this.total = this.dataService.getBasketTotal();		
		this.totalPlusShipment = this.total + this.selectedCarrier.cost;
		this.orderRows = this.dataService.getBasketRows();
	}
	//-----------------------------------------------------------------------------
	gotoItem( selectedItem: Item ): void {
		this.router.navigate( [ '/item' ], { queryParams: { itemId: selectedItem.id } } );
	}
	//-----------------------------------------------------------------------------
	postOrder(): void {
		alert( 'Your order has been posted' );
	}
	//-----------------------------------------------------------------------------
}