import { Component, 
	     OnInit }       from '@angular/core';
import { Router }       from '@angular/router';

import { DataService } from 'hs_services/data.service';

import { Category } from 'hs_core/category';

@Component({
	moduleId: module.id,
	selector: 'category-list-component',
	templateUrl: './category.list.component.html',
	styleUrls: [ './category.list.component.css' ],
})
//-----------------------------------------------------------------------------
export class CategoryListComponent implements OnInit {
	private categoryList: Category[] = [];
	//-----------------------------------------------------------------------------
	constructor( private router: Router,
				 private dataService: DataService ) {
	}
	//-----------------------------------------------------------------------------
	ngOnInit() {
		this.dataService.getCategoryList().then( categoryList => this.categoryList = categoryList );
	}
	//-----------------------------------------------------------------------------
	gotoItemList( selectedCategory: Category ) {
		let parObject = {};
		parObject[ 'categoryId' ] = selectedCategory.id;
		this.router.navigate( [ '/item-list' ], { queryParams: parObject } );
	}
	//-----------------------------------------------------------------------------
}