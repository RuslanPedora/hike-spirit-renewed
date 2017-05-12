import { Injectable }     from '@angular/core';
import { Http,
         Headers, 
         RequestOptions } from '@angular/http';
import { Subject }        from 'rxjs/Subject';
import { Observable }     from 'rxjs/Observable';

import 'rxjs/add/operator/toPromise';

import { LocalStorageService } from 'angular-2-local-storage';

import { Category } from 'hs_core/category';
import { Item }     from 'hs_core/item';
import { Image }    from 'hs_core/image';
import { OrderRow } from 'hs_core/order.row';
import { Carrier }  from 'hs_core/carrier';

@Injectable()
//-----------------------------------------------------------------------------
export class DataService {
	private hostUrl: string;
	private categoryUrl: string;
	private itemUrl: string;
	private carrierUrl: string;
	//-----------------------------------------------------------------------------
	private orderRows: OrderRow[] = [];
	//-----------------------------------------------------------------------------
	private basketEventEmitter = new Subject<string>(); 
	basketEventSource: Observable<string> = this.basketEventEmitter.asObservable();
	//-----------------------------------------------------------------------------
	constructor( private http: Http,
	             private localStorageService: LocalStorageService ) {
		this.hostUrl = window.location.origin;
		if( this.hostUrl.indexOf( 'localhost' ) >= 0 ) {
			this.hostUrl = this.hostUrl.replace( '3000', '8081' );
		}
		this.categoryUrl = this.hostUrl + '/getCategoryList';
		this.itemUrl = this.hostUrl + '/getItemList';
		this.carrierUrl = this.hostUrl + '/getCarrierList';

		this.restoreFromLocalStorage();
	}
    //-----------------------------------------------------------------------------
    getBasketTotal(): number {
    	let result: number = 0;
    	if( this.orderRows.length > 0 )
    		result = this.orderRows.map( element => element.total ).reduce( ( total, sum ) => total + sum );
    	return result;
    }
    //-----------------------------------------------------------------------------
    getBasketRows(): OrderRow[] {
    	return this.orderRows;
    }
    //-----------------------------------------------------------------------------
    addItemToBasket( item: Item, fixedQuiantity?: number ): void {		
    	let neededRow: number;
    	
    	neededRow = this.orderRows.findIndex( element => element.item.id == item.id );
    	if( neededRow < 0 )
			this.orderRows.push( new OrderRow( item ) );
		else {
			if( fixedQuiantity == undefined )
				this.orderRows[ neededRow ].quantity++;
			else	
				this.orderRows[ neededRow ].quantity = fixedQuiantity;
			if( this.orderRows[ neededRow ].quantity <= 0 ) {
				this.deleteItemToBasket( item );
				return;
			}
			this.orderRows[ neededRow ].total = this.orderRows[ neededRow ].quantity * 
			                                    this.orderRows[ neededRow ].item.discountPrice;
		}
		this.basketEventEmitter.next( '' );
		this.storeBasket();
    }    
    //-----------------------------------------------------------------------------
    storeBasket(): void {
    	this.localStorageService.set( 'hs_basket', JSON.stringify( this.orderRows ) );
    }
    //----------------------------------------------------------------------------
    restoreFromLocalStorage(): void {
    	let restoredValue: any;
    	restoredValue = this.localStorageService.get( 'hs_basket' );
    	try {
    		this.orderRows = JSON.parse( restoredValue );
    		if( this.orderRows == null )
    			this.orderRows = [];
    	}
    	catch( error ) {    		
    	}    	
    	this.basketEventEmitter.next( '' );
    }    
    //-----------------------------------------------------------------------------
    deleteItemToBasket( item: Item ): void {
    	let neededRow: number;
    	let discount: number;

    	neededRow = this.orderRows.findIndex( element => element.item.id == item.id );
    	if( neededRow >= 0 ) {
    		this.orderRows[ neededRow ].quantity--;
    		if( this.orderRows[ neededRow ].quantity <= 0 ) 
    			this.orderRows.splice( neededRow, 1 );
    		else {	
    			this.orderRows[ neededRow ].total = this.orderRows[ neededRow ].quantity * 
    		                                        this.orderRows[ neededRow ].item.discountPrice;
 			}   		                                        
    		this.basketEventEmitter.next( '' );
    		this.storeBasket();
    	}    	
    }
	//-----------------------------------------------------------------------------
	converRate( data: Item[] ): void {
		let rate: number;
		let k: any;

		for( let i in data ) {
			rate = data[ i ].rate;
			data[ i ].rateArray = [];
			for( let j = 0; j < 5; j++  ) {				
				data[ i ].rateArray.push( rate >= 1 ?  1 : rate );
				rate = Math.max( 0, rate - 1 );
			}
			for( k in data[ i ].imageList ) {
				data[ i ].imageList[ k ].shift = 100 * k;
			}
		}
	}	
	//-----------------------------------------------------------------------------
	getCategoryList(): Promise<Category[]> {
		return this.http.get( this.categoryUrl )
		           .toPromise()
		           .then( 
		           		response => response.json() as Category[]
		           	)
		           .catch( 
		           		error => 
		           			console.log( error )
		           	);
	}	
	//-----------------------------------------------------------------------------
	getItemList( query: string ): Promise<Item[]> {
		return this.http.get( this.itemUrl + query )
		           .toPromise()
		           .then( 
		           		response => response.json() as Item[]
		           	)
		           .catch( 
		           		error => 
		           			console.log( error )
		           	);
	}	
	//-----------------------------------------------------------------------------
	getCarrierList(): Promise<Carrier[]> {
		return this.http.get( this.carrierUrl )
		           .toPromise()
		           .then( 
		           		response => response.json() as Carrier[]
		           	)
		           .catch( 
		           		error => 
		           			console.log( error )
		           	);
	}	
	//-----------------------------------------------------------------------------}