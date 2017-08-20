import { Component, 
	     OnInit }      from '@angular/core';
import { Router }      from '@angular/router';

import { DataService } from 'hs_services/data.service';

import { Category } from 'hs_core/category';
import { Item } from 'hs_core/Item';

@Component({
	moduleId: module.id,
	selector: 'invitaion-component',
	templateUrl: './invitation.component.html',
	styleUrls: [ './invitation.component.css' ],
})
//-----------------------------------------------------------------------------
export class InvitationComponent implements OnInit {
	private categoryList: Category[] = [];
	private itemList: Item[] = [];
	//-----------------------------------------------------------------------------
	constructor(private router: Router, 
		        private dataService: DataService) {
	}
	//-----------------------------------------------------------------------------
	ngOnInit() {
		this.dataService.getCategoryList().then(categoryList => { 
			this.categoryList = categoryList;
			if (this.categoryList.length >= 4) {
				this.categoryList = this.categoryList.slice(0, 4);
			}
		});
		this.dataService.getNewItemList().then(itemList => this.itemList = itemList);
	}
	//-----------------------------------------------------------------------------
	gotoItemList(selectedCategory: Category) {
		this.router.navigate([ '/item-list' ], { queryParams: { categoryId: selectedCategory.id } });
	}
	//-----------------------------------------------------------------------------
	gotoItem(selectedItem: Item): void {
		this.router.navigate([ '/item' ], { queryParams: { id: selectedItem.id } });
	}
 	//-----------------------------------------------------------------------------
 	scrollDown(): void {
 		window.scrollTo(0, document.body.scrollHeight);
 	}
 	//-----------------------------------------------------------------------------
 	articles(): void {
 		this.dataService.showMessage('Articles will be added a little bit later...');
 	}
 	//-----------------------------------------------------------------------------
 	scrollToQuote(): void {
		window.scrollTo(0, document.getElementById('pageintro').offsetTop);
 	}
}