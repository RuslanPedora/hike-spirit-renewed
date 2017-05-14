import { Image } from 'hs_core/image';

export class Item {
	id: number;
	name: string;
	categoryId: number;
	mainImage: string;
	price: number;
	dsicount: number;
	discountPrice: number;
	rate: number;
	rateArray: number[] = [];
	newItem: boolean = true;
	description: string;
	shortDescription: string;
	imageList: Image[] = [];
	constructor () {
		this.id = -1;
		this.name = '';
		this.imageList = [];
	}
}