import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InvitationComponent }  from 'hs_app/component-invitation/invitation.component';

 const routes: Routes = [
 	{ path: '', redirectTo: '/invitation', pathMatch: 'full' },
 	{ path: 'invitation', component: InvitationComponent },
 ];

@NgModule({
	imports: [ RouterModule.forRoot( routes ) ],
	exports: [ RouterModule ]
})

export class RoutingModule {
}