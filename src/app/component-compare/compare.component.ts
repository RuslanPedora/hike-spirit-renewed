import { Component, 
	     OnInit }         from '@angular/core';
import { Router, 
	     ActivatedRoute } from '@angular/router';

import { DataService }    from 'hs_services/data.service';

import { Item } from 'hs_core/item';

@Component({
	moduleId: module.id,
	selector: 'compare-items',
	templateUrl: './compare.component.html',
	styleUrls: [ './compare.component.css' ],
})
//-----------------------------------------------------------------------------
export class CompareItems implements OnInit {
	private compareItems: Item[] = [];
	private compareProperties: any[][] = [];
	private collapse: boolean = true;
	private compared: boolean = false;
	//-----------------------------------------------------------------------------
	constructor(private router: Router,
				private activatedRoute: ActivatedRoute,
				private dataService: DataService) {
	}
	//-----------------------------------------------------------------------------
	ngOnInit() {
		this.compareItems = this.dataService.getCompareList();				
		this.activatedRoute.queryParams.subscribe(
			queryParams => {				
				let collapse = queryParams [ 'collapse' ];
				this.collapse = (collapse == undefined);				
			}
		);
	}
	//-----------------------------------------------------------------------------
	processItem(selectedItem: Item): void {
		let parObject = {};

		if (this.collapse) {
			parObject[ 'collapse' ] = false;
			this.router.navigate([ '/compare-items' ], { queryParams: parObject });
		}
		else {
			parObject[ 'id' ] = selectedItem.id;		
			this.router.navigate([ '/item' ], { queryParams: parObject });
		}
	}
	//-----------------------------------------------------------------------------
	removeItem(selectedItem: Item): void {
		this.dataService.removeToCompareList(selectedItem);
		this.compareItems = this.dataService.getCompareList();
		this.compared = false;
	}
	//-----------------------------------------------------------------------------
	compare(): void {
		let queryString: string;		
		let tempList: any[] = [];
		let itemId: number;
		let propertyName = '';
		let propertyValues: any[] = [];
		let tempArray: any[] = [];

		queryString = this.compareItems.map(el => `id=${el.id}`).join('&');

		this.dataService.getComparedProperties(queryString).then(dataList => {
			tempList = dataList;
			for (let i in this.compareItems) {
				itemId = this.compareItems[ i ].id;
				dataList.forEach(element => { 
						if (element.itemId == itemId) 
							element[ 'sortKey' ] = i;
				});				
			}
			dataList.sort(this.comparator);
			this.compareProperties = [];
			for (let i in dataList) {
				if (propertyName != dataList[ i ].propertyName) {
					if (propertyName != '') {
						tempArray = [];
						tempArray.push(propertyName);
						for (let j in propertyValues) {
							tempArray.push(propertyValues[ j ]);		
						}
						this.compareProperties.push(tempArray);
					}					
					propertyValues = [];
					propertyName = dataList[ i ].propertyName;
				}
				propertyValues.push(dataList[ i ].value);
			}
			if (propertyName != '') {
				tempArray = [];
				tempArray.push(propertyName);
				for (let j in propertyValues) {
					tempArray.push(propertyValues[ j ]);		
				}
				this.compareProperties.push(tempArray);
			}			
		});
		this.compared = true;
	}
	//-----------------------------------------------------------------------------
	comparator(a: any, b: any): number {
		if (a.propertyName < b.propertyName)
			return -1;
		else if (a.propertyName > b.propertyName)
			return 1;
		else
			return (a.sortKey < b.sortKey ? -1 : 1);
	}
	//-----------------------------------------------------------------------------
}