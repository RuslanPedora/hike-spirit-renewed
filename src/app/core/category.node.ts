import { Category } from 'hs_core/category';

export class CategoryNode {
	category: Category;
	itemCount: number = 0;
	level: number = 0;
	nodes: CategoryNode[] = [];
	constructor( category: Category, itemCount: number, level: number ) {
		this.category = category;
		this.level = level;
		this.itemCount = itemCount;
		this.nodes = [];
	}
}