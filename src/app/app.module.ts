import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { HttpModule }     from '@angular/http';

import {HashLocationStrategy, Location, LocationStrategy} from '@angular/common';

import { LocalStorageModule } from 'angular-2-local-storage';

import { ApplicationComponent } from './app.component';
import { InvitationComponent }  from 'hs_app/component-invitation/invitation.component';

import { RoutingModule }   from './routing.module';

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
  declarations: [ ApplicationComponent, InvitationComponent ],
  providers: [ Location, 
              { provide: LocationStrategy, 
                useClass: HashLocationStrategy}
             ],
  bootstrap: [ ApplicationComponent ]
})
export class AppModule { }