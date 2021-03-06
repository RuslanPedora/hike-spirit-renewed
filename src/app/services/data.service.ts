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
import { ItemProperty }  from 'hs_core/item.property';

@Injectable()
//-----------------------------------------------------------------------------
export class DataService {
	private hostUrl: string;
	private categoryUrl: string;
	private itemUrl: string;
	private newItemUrl: string;
	private carrierUrl: string;
	private comparedPropertiesUrl: string;
	private categoryTreeDataUrl: string;
	private orderUrl: string;
	//-----------------------------------------------------------------------------
	private lastViewItems: Item[] = [];
	private maxViewItems: number = 5;
	private compareItems: Item[] = [];
	private maxCompareItems: number = 5;
	private orderRows: OrderRow[] = [];
	//-----------------------------------------------------------------------------
	private basketEventEmitter = new Subject<string>(); 
	basketEventSource: Observable<string> = this.basketEventEmitter.asObservable();
	private pathEventEmitter = new Subject<any[]>(); 
	pathEventSource: Observable<any[]> = this.pathEventEmitter.asObservable();
	private messenger = new Subject<string>(); 
	messageSource: Observable<string> = this.messenger.asObservable();
	//-----------------------------------------------------------------------------
	constructor(private http: Http,
	            private localStorageService: LocalStorageService) {
		this.hostUrl = window.location.origin;
		if (this.hostUrl.indexOf('localhost') >= 0) {
			this.hostUrl = this.hostUrl.replace('3000', '8888');
		}
		this.categoryUrl           = this.hostUrl + '/categories';
		this.categoryTreeDataUrl   = this.hostUrl + '/categories-tree';
		this.carrierUrl            = this.hostUrl + '/carriers';
		this.newItemUrl            = this.hostUrl + '/items-new';
		this.itemUrl               = this.hostUrl + '/items';		
		this.comparedPropertiesUrl = this.hostUrl + '/property-comparison';
		this.orderUrl              = this.hostUrl + '/orders';

		this.restoreFromLocalStorage();
	}
    //-----------------------------------------------------------------------------
    getBasketTotal(): number {
    	let result: number = 0;

    	if (this.orderRows.length > 0) {
    		result = this.orderRows.map(element => element.total).reduce((total, sum) => total + sum);
		}	
    	return result;
    }
    //-----------------------------------------------------------------------------
    getBasketRows(): OrderRow[] {
    	return this.orderRows;
    }
    //-----------------------------------------------------------------------------
    addItemToBasket(item: Item, fixedQuiantity?: number): void {		
    	let neededRow: number;
    	
    	neededRow = this.orderRows.findIndex(element => element.item.id == item.id);
    	if (neededRow < 0)
			this.orderRows.push(new OrderRow(item));
		else {
			if (fixedQuiantity == undefined)
				this.orderRows[ neededRow ].quantity++;
			else	
				this.orderRows[ neededRow ].quantity = fixedQuiantity;
			if (this.orderRows[ neededRow ].quantity <= 0) {
				this.deleteItemToBasket(item);
				return;
			}
			this.orderRows[ neededRow ].total = this.orderRows[ neededRow ].quantity * 
			                                    this.orderRows[ neededRow ].item.discountPrice;
		}
		this.basketEventEmitter.next('');
		this.storeBasket();
    }    
    //-----------------------------------------------------------------------------
    storeBasket(): void {
    	this.localStorageService.set('hs_basket', JSON.stringify(this.orderRows));
    }
    //----------------------------------------------------------------------------
    restoreFromLocalStorage(): void {
    	let restoredValue: any;

    	restoredValue = this.localStorageService.get('hs_basket');
    	try {
    		this.orderRows = JSON.parse(restoredValue);
    		if (this.orderRows === null) {
    			this.orderRows = [];
			}	
    	}
    	catch (err) {    		
    	}    	
    	this.basketEventEmitter.next('');
    	
    	restoredValue = this.localStorageService.get('hs_compareList');
    	try {
    		this.compareItems = JSON.parse(restoredValue);
    		if (this.compareItems == null){
    			this.compareItems = [];
			}	
    	}
    	catch (err) {    		
    	}    	

    	restoredValue = this.localStorageService.get('hs_viewList');
    	try {
    		this.lastViewItems = JSON.parse(restoredValue);
    		if (this.lastViewItems == null){
    			this.lastViewItems = [];
			}	
    	}
    	catch (err) {    		
    	}    	
    }    
    //-----------------------------------------------------------------------------
    deleteItemToBasket(item: Item): void {
    	let neededRow: number;
    	let discount: number;

    	neededRow = this.orderRows.findIndex(element => element.item.id == item.id);
    	if (neededRow >= 0) {
    		this.orderRows[ neededRow ].quantity--;
    		if (this.orderRows[ neededRow ].quantity <= 0) 
    			this.orderRows.splice(neededRow, 1);
    		else {	
    			this.orderRows[ neededRow ].total = this.orderRows[ neededRow ].quantity * 
    		                                        this.orderRows[ neededRow ].item.discountPrice;
 			}   		                                        
    		this.basketEventEmitter.next('');
    		this.storeBasket();
    	}    	
    }
	//-----------------------------------------------------------------------------
	converRate(data: Item[]): void {
		let rate: number;
		let k: any;

		for (let i in data) {
			rate = data[ i ].rate;
			data[ i ].rateArray = [];
			for (let j = 0; j < 5; j++) {				
				data[ i ].rateArray.push(rate >= 1 ?  1 : rate);
				rate = Math.max(0, rate - 1);
			}
			for (k in data[ i ].imageList) {
				data[ i ].imageList[ k ].shift = 100 * k;
				data[ i ].imageList[ k ].smallShift = 20 * k;
			}
		}
	}	
	//-----------------------------------------------------------------------------
	getProperties(categoryId: number): Promise<any[]>  {
		return this.http.get(`${this.categoryUrl}/${categoryId}/property-filter`)
		           .toPromise()
		           .then(response => response.json())
		           .catch(error => console.log(error));
	}
	//-----------------------------------------------------------------------------
	getCategoryList(): Promise<Category[]> {
		return this.http.get(this.categoryUrl)
		           .toPromise()
		           .then(response => response.json() as Category[])
		           .catch(error => console.log(error));
	}	
	//-----------------------------------------------------------------------------
	getCategoryTreeData(): Promise<any[]> {
		return this.http.get(this.categoryTreeDataUrl)
		           .toPromise()
		           .then(response => response.json())
		           .catch(error => console.log(error));
	}	
	//-----------------------------------------------------------------------------
	getItemList(query: string): Promise<Item[]> {
		return this.http.get(`${this.itemUrl}?${query}`)
		           .toPromise()
		           .then(response => response.json() as Item[])
		           .catch(error => console.log(error));
	}	
	//-----------------------------------------------------------------------------
	getCarrierList(): Promise<Carrier[]> {
		return this.http.get(this.carrierUrl)
		           .toPromise()
		           .then(response => response.json() as Carrier[])
		           .catch(error => console.log(error));
	}	
	//-----------------------------------------------------------------------------
	getItemProperties(itemId: number): Promise<ItemProperty[]> {
		return this.http.get(`${this.itemUrl}/${itemId}/properties`)
		           .toPromise()
		           .then(response => response.json() as ItemProperty[])
		           .catch(error => console.log(error));
	}	
	//-----------------------------------------------------------------------------
	getNewItemList(): Promise<Item[]> {
		return this.http.get(this.newItemUrl)
		           .toPromise()
		           .then(response => response.json() as Item[])
		           .catch(error => console.log(error));
	}		
	//-----------------------------------------------------------------------------
	getComparedProperties(query: string): Promise<any[]> {
		return this.http.get(`${this.comparedPropertiesUrl}?${query}`)
		           .toPromise()
		           .then(response => response.json())
		           .catch(error => console.log(error));
	}		
	//-----------------------------------------------------------------------------
	postOrder(orderObject: any): Promise<string> {
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });		

		return this.http.post(this.orderUrl, JSON.stringify(orderObject), options)
		           .toPromise()
		           .then(response => response.json())
		           .catch(error => console.log(error));
	}
	//-----------------------------------------------------------------------------
	addToComapreItem(item: Item): void {
		let index: number;

		if (this.compareItems.findIndex(element => element.id == item.id) >= 0)
			return;
		if (this.compareItems.length == this.maxCompareItems) {
			this.compareItems.shift();
		}
		this.compareItems.push(item);
		this.localStorageService.set('hs_compareList', JSON.stringify(this.compareItems));
	}	
	//-----------------------------------------------------------------------------
	removeToCompareList(item: Item) {
		this.compareItems = this.compareItems.filter(element => element.id != item.id);
		this.localStorageService.set('hs_compareList', JSON.stringify(this.compareItems));
	}
	//-----------------------------------------------------------------------------
	getCompareList(): Item[] {
		return this.compareItems;
	}
	//-----------------------------------------------------------------------------
	addToViewItem(item: Item): void {
		let index: number;

		if (this.lastViewItems.findIndex(element => element.id == item.id) >= 0)
			return;
		if (this.lastViewItems.length == this.maxViewItems) {
			this.lastViewItems.shift();
		}
		this.lastViewItems.push(item);
		this.localStorageService.set('hs_viewList', JSON.stringify(this.lastViewItems));
	}
	//-----------------------------------------------------------------------------
	getLastViewedItems(): Item[] {
		return this.lastViewItems;
	}
	//-----------------------------------------------------------------------------
	showMessage(text: string) : void {
		this.messenger.next(text);
	}	
	//-----------------------------------------------------------------------------
	buildPath(parObject: any, itemPath: boolean = false): void {
		let addPath: string;

		addPath = itemPath ? `/${parObject.categoryId}/path` :
			                 `/${parObject.id}/path`;

		this.http.get(`${this.categoryUrl}${addPath}`)
		           .toPromise()
		           .then(data => {
					    let categoryPath:any = data.json();

		           		if (parObject[ 'mainImage' ]) {
		           			categoryPath.push(parObject);
 					    }	   
		           		this.pathEventEmitter.next(categoryPath);
				    })
		           .catch(error => console.log(error));
	}
	//-----------------------------------------------------------------------------
}