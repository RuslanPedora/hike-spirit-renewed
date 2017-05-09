import { Image } from 'hs_core/image';

export class Item {
	id: number;
	name: string;
	categoryId: number;
	price: number;
	dsicount: number;
	discountPrice: number;
	rate: number;
	newItem: boolean = true;
	description: string;
	shortDescription: string;
	image: Image;
}