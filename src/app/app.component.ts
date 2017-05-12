import { Component, 
	     OnInit }         from '@angular/core';
import { Router,
		 ActivatedRoute } from '@angular/router';
import { Subscription }   from 'rxjs/Subscription';

import { DataService } from 'hs_services/data.service';

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
export class ApplicationComponent implements OnInit {
	private routerListener: Subscription;
	private basketListener: Subscription;
	private total: number = 0;
	//-----------------------------------------------------------------------------
	constructor( private router: Router,
				 private dataService: DataService ) {
	}
	//-----------------------------------------------------------------------------
	ngOnInit() {
		this.routerListener = this.router.events.subscribe( this.resizeOutlet );
		this.basketListener = this.dataService.basketEventSource.subscribe(
			                        	  eventValue => 
			                               this.total = this.dataService.getBasketTotal()
			                             );
		this.total = this.dataService.getBasketTotal();
	}
	//-----------------------------------------------------------------------------
	onResize( event: any ): void {
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
   		if( event.url.indexOf( 'invitation' ) >= 0 ) {
			elementOutlet.style.maxWidth = '100%';
			elementContacts.style.maxWidth = '100%';
			elementCopyRights.style.maxWidth = '100%';
   		}
		else {
			elementOutlet.style.maxWidth = '1000px';
			elementContacts.style.maxWidth = '1000px';
			elementCopyRights.style.maxWidth = '1000px';
		}
   		if( event.url.indexOf( 'item' ) >= 0 || event.url.indexOf( 'basket' ) >= 0 ) {
			elementPanelDiv.style.display = 'block';
   		}
		else {
			elementPanelDiv.style.display = 'none';
		}
   		if( event.url.indexOf( 'category-list' ) >= 0 ) {
			elementBGImage.style.opacity = '.8';
   		}
		else {
			elementBGImage.style.opacity = '1';
		}
   	}
}