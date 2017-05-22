import { Component, 
	     OnInit,
	     OnDestroy,
	     AfterContentInit } from '@angular/core';
import { Router,
		 ActivatedRoute } from '@angular/router';
import { Subscription }   from 'rxjs/Subscription';
import { Location }       from '@angular/common';

import { DataService }  from 'hs_services/data.service';
import { Item }         from 'hs_core/item';
import { Category }     from 'hs_core/category';
import { CategoryNode } from 'hs_core/category.node';

@Component({
	moduleId: module.id,
	selector: 'app-component',
	templateUrl: './app.component.html',
	styleUrls: [ './app.component.css' ],
	host: {
	    '(window:resize)': 'onResize($event)'
  	}	
})
//-----------------------------------------------------------------------------
export class ApplicationComponent implements OnInit, OnDestroy, AfterContentInit {
	private routerListener: Subscription;
	private basketListener: Subscription;
	private pathListener: Subscription;
	private total: number = 0;
	private categoryPath: any[] = [];
	private categoryNodes: CategoryNode[] = [];
	//-----------------------------------------------------------------------------
	constructor( private router: Router,
				 private activatedRoute: ActivatedRoute,
				 private dataService: DataService,
				 private location: Location ) {
	}
	//-----------------------------------------------------------------------------
	ngOnInit() {
		this.routerListener = this.router.events.subscribe( event => {
			this.categoryPath = [];
			this.resizeOutlet( event );		
		} );
		this.basketListener = this.dataService.basketEventSource.subscribe(
			                        	  eventValue => 
			                               this.total = this.dataService.getBasketTotal()
			                             );
		this.pathListener = this.dataService.pathEventSource.subscribe (
										  eventValue => 
										   this.categoryPath = eventValue
		)
		this.activatedRoute.queryParams.subscribe(
			queryParams => {				
				let categoryIdPar = queryParams [ 'categoryId' + this.dataService.getItemPrefix() ];
				if( categoryIdPar != undefined ) {
					this.dataService.buildPath( { id: Number.parseInt( categoryIdPar ) } );
				}
			}
		);				
		this.dataService.getCategoryTreeData().then( treeData => { this.categoryNodes = this.buildCategoryTree( treeData, 0 ) } );
		this.total = this.dataService.getBasketTotal();
	}
	//-----------------------------------------------------------------------------
	ngAfterContentInit() {
		this.onResize( undefined );
	}
	//-----------------------------------------------------------------------------
	ngOnDestroy() {
		this.routerListener.unsubscribe();
		this.basketListener.unsubscribe();
		this.pathListener.unsubscribe();
	}
	//-----------------------------------------------------------------------------
	buildCategoryTree( treeData: any[], level: number, parentId?: number ): any[] {
		let tempArray:any[] = [];
		let nodeArray:CategoryNode[] = [];		
		let currentNode: CategoryNode;
		if( level == 0 ) {
			tempArray = treeData.filter( element => element.parentId == 0 );
			for( let i in tempArray ) {
				currentNode = new CategoryNode( new Category( tempArray[ i ].categoryId, tempArray[ i ].categoryName, '' ), 
					                                          tempArray[ i ].itemCount, 
					                                          level )
				currentNode.nodes = this.buildCategoryTree( treeData, level + 1, currentNode.category.id );
				currentNode.itemCount = this.calculateItemCount( currentNode );
				nodeArray.push( currentNode );				
			}
			return nodeArray;
		}
		else {
			tempArray = treeData.filter( element => element.parentId == parentId );
			for( let i in tempArray ) {
				currentNode = new CategoryNode( new Category( tempArray[ i ].categoryId, tempArray[ i ].categoryName, '' ), 
					                                          tempArray[ i ].itemCount, 
					                                          level )
				currentNode.nodes = this.buildCategoryTree( treeData, level + 1, currentNode.category.id );
				nodeArray.push( currentNode );				
			}
			return nodeArray;
		}
	}
	//-----------------------------------------------------------------------------
	calculateItemCount( categoryNode: CategoryNode ): number {
		let result = 0;
		result += categoryNode.itemCount;
		for( let i in categoryNode.nodes )
			result += this.calculateItemCount( categoryNode.nodes[ i ] );
		return result;
	}
	//-----------------------------------------------------------------------------
	goPath( pathElelement: any ) {
		let parObject = {};
		if( pathElelement.hasOwnProperty( 'mainImage' ) ) {
		}
		else {
			parObject[ 'categoryId' + this.dataService.getItemPrefix() ] = pathElelement.id;		
			this.router.navigate( [ '/item-list' ], { queryParams: parObject } );
		}
	}
	//-----------------------------------------------------------------------------
	onResize( event: any ): void {
		let homeButton: any;
		let forwardButton: any;
		let searchInput: any;
		let basketBar: any;

		searchInput = document.getElementById( 'searchInput' );
		homeButton  = document.getElementById( 'homeNavButton' );
		basketBar   = document.getElementById( 'basketBar' );

		forwardButton = document.getElementById( 'forwardNavButton' );			
		searchInput.style.width = ( forwardButton.offsetLeft + forwardButton.clientWidth - homeButton.offsetLeft - 40 + 1 ).toString() + 'px';
 	}
   	//-----------------------------------------------------------------------------
   	gotoBasket(): void {
   		this.router.navigate( [ '/basket' ] );
   	}
   	//-----------------------------------------------------------------------------
   	resizeOutlet( event: any ):void {
   		let elementOutlet: any;
   		let elementContacts: any;
   		let elementCopyRights: any;
   		let elementPanelDiv: any;
   		let elementBGImage: any;

   		elementOutlet     = document.getElementById( 'outlerDiv' );
   		elementContacts   = document.getElementById( 'contactDiv' );
   		elementCopyRights = document.getElementById( 'copyright' );
   		elementPanelDiv = document.getElementById( 'panelDiv' );
   		elementBGImage = document.getElementById( 'mainBgImage' );
   		if( event.url.indexOf( 'invitation' ) >= 0 || event.url == '/') {
			elementOutlet.style.maxWidth = '100%';
			elementContacts.style.maxWidth = '100%';
			elementCopyRights.style.maxWidth = '100%';
			elementPanelDiv.style.display = 'none';
   		}
		else {
			elementOutlet.style.maxWidth = '1000px';
			elementContacts.style.maxWidth = '1000px';
			elementCopyRights.style.maxWidth = '1000px';
			elementPanelDiv.style.display = 'block';
		}
   		if( event.url.indexOf( 'category-list' ) >= 0 ) {
			elementBGImage.style.opacity = '.8';
   		}
		else {
			elementBGImage.style.opacity = '1';
		}
   	}
   	//-----------------------------------------------------------------------------
   	scrollTop():void {
	   	window.scrollTo( 0, 0 );
    }
    //-----------------------------------------------------------------------------
    subscribe(): void {
         alert( 'You have subscribed' );   		
    }
    //-----------------------------------------------------------------------------
    searchItem( searchKey: string ): void {
		let parObject = {};
		let keyAsNumber: any;
		parObject[ 'name' + this.dataService.getItemPrefix() ] = searchKey;
		
		keyAsNumber = Number.parseInt( searchKey );
		if( !isNaN( keyAsNumber ) )
			parObject[ 'searchId' + this.dataService.getItemPrefix() ] = searchKey;
		if( searchKey == '' )
			this.router.navigate( [ '/item-list' ] );
		else	
			this.router.navigate( [ '/item-list' ], { queryParams: parObject } );
    }
 	//-----------------------------------------------------------------------------
 	scrollDown(): void {
 		window.scrollTo( 0, document.body.scrollHeight );
 	}
 	//-----------------------------------------------------------------------------
 	back():void {
		this.location.back();
 	}
 	//-----------------------------------------------------------------------------
 	forwar():void {
		this.location.forward();
 	}
	//-----------------------------------------------------------------------------
}