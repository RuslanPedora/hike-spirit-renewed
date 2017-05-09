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

@Injectable()
//-----------------------------------------------------------------------------
export class DataService {
	private hostUrl: string;
	private categoryUrl: string;
	private itemUrl: string;
	//-----------------------------------------------------------------------------
	constructor( private http: Http ) {
		this.hostUrl = window.location.origin;
		if( this.hostUrl.indexOf( 'localhost' ) >= 0 ) {
			this.hostUrl = this.hostUrl.replace( '3000', '8081' );
		}
		this.categoryUrl = this.hostUrl + '/getCategoryList';
		this.itemUrl = this.hostUrl + '/getItemList';
	}

	//-----------------------------------------------------------------------------
	converRate( data: Item[] ): void {
		let rate: number;

		for( let i in data ) {
			rate = data[ i ].rate;
			data[ i ].rateArray = [];
			for( let j = 0; j < 5; j++  ) {				
				data[ i ].rateArray.push( rate >= 1 ?  1 : rate );
				rate = Math.max( 0, rate - 1 );
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
}