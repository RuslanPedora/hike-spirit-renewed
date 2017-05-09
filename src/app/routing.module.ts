import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InvitationComponent }   from 'hs_app/component-invitation/invitation.component';
import { ItemListComponent }     from 'hs_app/component-item-list/item.list.component';
import { CategoryListComponent } from 'hs_app/component-category-list/category.list.component';
import { BasketComponent }       from 'hs_app/component-basket/basket.component';

 const routes: Routes = [
 	{ path: '', redirectTo: '/invitation', pathMatch: 'full' },
 	{ path: 'invitation', component: InvitationComponent },
 	{ path: 'item-list', component: ItemListComponent },
 	{ path: 'category-list', component: CategoryListComponent },
 	{ path: 'basket', component: BasketComponent },
 ];

@NgModule({
	imports: [ RouterModule.forRoot( routes ) ],
	exports: [ RouterModule ]
})

export class RoutingModule {
}