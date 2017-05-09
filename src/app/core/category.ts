export class Category {
	id: number = -1;
	name: string = '';
	image: string = '';
	Category( id: number, name: string, image: string ) {
		this.id = id;
		this.name = name;
		this.image = image;
	}
}