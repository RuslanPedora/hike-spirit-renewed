export class Property {
	id: number;
	name: string;
	values: any[];
	selected: boolean;
	constructor ( id: number, name: string, values: any[] ) {
		this.id       = id;
		this.name     = name;
		this.values   = values;
		this.selected = false;
	}
}