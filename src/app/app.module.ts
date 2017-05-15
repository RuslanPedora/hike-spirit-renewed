import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { HttpModule }     from '@angular/http';

import {HashLocationStrategy, Location, LocationStrategy} from '@angular/common';

import { LocalStorageModule }   from 'angular-2-local-storage';

import { ApplicationComponent }  from './app.component';
import { InvitationComponent }   from 'hs_app/component-invitation/invitation.component';
import { ItemListComponent }     from 'hs_app/component-item-list/item.list.component';
import { ItemComponent }         from 'hs_app/component-item/item.component';
import { CategoryListComponent } from 'hs_app/component-category-list/category.list.component';
import { BasketComponent }       from 'hs_app/component-basket/basket.component';
import { LastViewedItems }       from 'hs_app/component-last-viewed-items/last.viewed.items.component';
import { CompareItems }       from 'hs_app/component-compare/compare.component';

import { DataService } from 'hs_services/data.service';

import { RoutingModule } from './routing.module';

@NgModule({
  imports: [ BrowserModule, 
             FormsModule, 
             RoutingModule, 
             HttpModule
             , LocalStorageModule.withConfig({
            			prefix: 'hike-spirit',
             			storageType: 'localStorage'
        			 }) 
           ],
  declarations: [ ApplicationComponent, 
                  InvitationComponent, 
                  ItemListComponent,
                  ItemComponent,
                  CategoryListComponent,
                  BasketComponent,
                  LastViewedItems,
                  CompareItems ],
  providers: [ Location, 
              { provide: LocationStrategy, 
                useClass: HashLocationStrategy},
                DataService
             ],
  bootstrap: [ ApplicationComponent ]
})
export class AppModule { }