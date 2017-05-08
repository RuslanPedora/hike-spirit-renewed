import { Component, 
	     OnInit }       from '@angular/core';
import { Router }       from '@angular/router';

@Component({
	moduleId: module.id,
	selector: 'invitaion-component',
	templateUrl: './invitation.component.html',
	styleUrls: [ './invitation.component.css' ],
})
//-----------------------------------------------------------------------------
export class InvitationComponent implements OnInit {
	private categoryList: number[] = [ 1, 2342, 3, 9909424 ];
	private itemList: number[] = [ 1, 2, 3 ];
	private brandList: number[] = [ 1, 2, 3, 4, 5 ];
	//-----------------------------------------------------------------------------
	constructor( private router: Router ) {
	}
	//-----------------------------------------------------------------------------
	ngOnInit() {
	}
	//-----------------------------------------------------------------------------
	onResize( event: any ){
   	}
}