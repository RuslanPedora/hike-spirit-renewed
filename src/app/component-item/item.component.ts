import { Component, 
	     OnInit }         from '@angular/core';
import { Router, 
	     Params, 
	     ActivatedRoute } from '@angular/router';

import { DataService } from 'hs_services/data.service';

import { Item }     from 'hs_core/item';
import { Image }    from 'hs_core/image';
import { ItemProperty }  from 'hs_core/item.property';


@Component({
	moduleId: module.id,
	selector: 'item-component',
	templateUrl: './item.component.html',
	styleUrls: [ './item.component.css' ],
})
//-----------------------------------------------------------------------------
export class ItemComponent implements OnInit {
	private item: Item = new Item();
	private itemProperties: ItemProperty[] = [];
	private loupeFragment: string = 'logo.jpg';
	private reEnter: boolean = false;
	private offsetX: number;
	private offsetY: number;

	private elementLuope: any;
	private elementBigImage: any;
	private elementLoupeFragment: any;
	private elementLoupeImage: any;
	private mouseEntered: boolean = false;
	private debugString: string = '';
	private detailBlockIndex: number = 0;
	//-----------------------------------------------------------------------------
	constructor( private router: Router,
				 private activatedRoute: ActivatedRoute,
				 private dataService: DataService ) {
	}
	//-----------------------------------------------------------------------------
	ngOnInit() {
		this.activatedRoute.queryParams.subscribe(
			queryParams => {				
				let itemId = queryParams [ 'id' + this.dataService.getItemPrefix() ];
				if( itemId != undefined ) {
					this.getItem( Number.parseInt( itemId ) );
					this.getItemProperties( Number.parseInt( itemId ) );
				}
			}
		);	
		window.scrollTo( 0, 0 );			
	}
	//-----------------------------------------------------------------------------
	getItem( itemId: number ):void {
		let tempList: Item[];
		this.dataService.getItemList( '/?' + JSON.stringify( { id_IT: itemId } ) )
		                .then( itemList => { tempList = itemList;
			                                 this.dataService.converRate( tempList );
			                                 if( tempList.length > 0 ) {
			                                     this.item = tempList[0];
			                                     this.dataService.addToViewItem( this.item );
			                                     this.dataService.buildPath( this.item );
			                                     if( this.reEnter && this.item.imageList.length > 0 ) {
			                                     	this.loupeFragment = this.item.imageList[ 0 ].bigImage;
			                                     	this.mouseEntered = true;
			                                     	this.posBigImage( this.offsetX, this.offsetY );
			                                     }

			                                 }
		} ); 
	}
	//-----------------------------------------------------------------------------
	getItemProperties( itemId: number ):void {
		this.dataService.getItemProperties( '/?' + JSON.stringify( { id: itemId } ) )
		                .then( itemProperties => 
		                	                     this.itemProperties = itemProperties 
		                	 ); 
	}
	//-----------------------------------------------------------------------------
	scrollBigImage( forward: boolean ):void {
		let imageIndex = 0;
		let i: any;
		let item: Item = this.item;		

		if( item.imageList.length <= 1 ) 
			return;
		
		imageIndex = item.imageList.findIndex( element => element.shift == 0 );
		if( forward && imageIndex == item.imageList.length  - 1 ) {
			for( i in item.imageList )
				item.imageList[ i ].shift = 100 * i;
		}
		else if ( !forward && imageIndex == 0 ) {
			for( i in item.imageList )
				item.imageList[ i ].shift = -100 * ( item.imageList.length - i - 1 );
		}
		else {
			for( i in item.imageList )  
				item.imageList[ i ].shift += forward ? -100 : 100 ;
		}		
		this.scrollSmallImageList();
	}
	//-----------------------------------------------------------------------------
	smallImageSelect( index: number ):void {
		let i: any;
		for( i in this.item.imageList ) {
			this.item.imageList[ i ].shift = ( i - index) * 100;			
		}
		this.scrollSmallImageList();
	}	
	//-----------------------------------------------------------------------------
	scrollSmallImageList(): void {
		let i: any;
		let delta: number = 0;
		if( this.item.imageList[ 0 ].shift / 100 == 0 ) {
			delta =  -40;
		}
		if( this.item.imageList[ 0 ].shift / 100 == -1 ) {
			delta =  -20;
		}
		if( this.item.imageList.length > 5 ) {
			if( this.item.imageList[ this.item.imageList.length - 1 ].shift == 0 ) {
				delta =  40;
			}
			if( this.item.imageList[ this.item.imageList.length - 2 ].shift == 0 ) {
				delta =  20;
			}

		}
		
		for( i in this.item.imageList ) {
			this.item.imageList[ i ].smallShift = 20 * this.item.imageList[ i ].shift / 100 + 40 + delta;
		}		
	}
	//-----------------------------------------------------------------------------
	mouseMove( event: any ) {
		this.posBigImage( event.offsetX, event.offsetY );
	}
	//-----------------------------------------------------------------------------
	posBigImage( offsetX: number , offsetY: number ): void {
		let newLeft: number;
		let newTop: number;

		if( this.mouseEntered ) {
			newLeft	= Math.min( offsetX, this.elementBigImage.clientWidth - this.elementLuope.clientWidth - 2 );
			newTop  = Math.min( offsetY, this.elementBigImage.clientHeight - this.elementLuope.clientHeight - 2 );

			this.elementLuope.style.left = '' + newLeft + 'px';
			this.elementLuope.style.top  = '' + newTop + 'px';
			if( this.elementLoupeFragment != null ) {
				this.elementLoupeFragment.style.left = '-' + ( newLeft / this.elementBigImage.clientWidth * this.elementLoupeFragment.clientWidth - this.elementBigImage.clientWidth/2 ) + 'px';
				this.elementLoupeFragment.style.top  = '-' + ( newTop / this.elementBigImage.clientHeight * this.elementLoupeFragment.clientHeight ) + 'px';
			}
		}
	}
	//-----------------------------------------------------------------------------
	mouseEnter( event: any ) {
		let zeroIndex: number;


		this.elementLuope         = document.getElementById( 'loupe' );
		this.elementBigImage      = document.getElementById( 'bigImageDiv' );
		
		this.elementLoupeImage    = document.getElementById( 'loupeImageDiv' );
		this.elementLoupeFragment = document.getElementById( 'loupeImageFragment' );

		this.elementLoupeImage.style.display = 'block';		


		if( this.item.imageList.length == 0 ) {
			this.reEnter = true;			
			this.offsetX = event.offsetX;
			this.offsetY = event.offsetY;
			return;
		}
		zeroIndex = this.item.imageList.findIndex( element => element.shift == 0 );

		this.loupeFragment = this.item.imageList[ zeroIndex ].bigImage;
		this.mouseEntered = true;
	}
	//-----------------------------------------------------------------------------
	mouseLeave( event: any ) {
		if( this.item.imageList.length == 0 )
			return;
		this.elementLoupeImage.style.display = 'none';		
		this.mouseEntered = false;
	}
	//-----------------------------------------------------------------------------
	buyItem(): void {
		this.dataService.addItemToBasket( this.item );
	}
	//-----------------------------------------------------------------------------
	addToCompareItem(): void {
		if( this.item.id > 0 )
			this.dataService.addToComapreItem( this.item );
	}
	//-----------------------------------------------------------------------------
}