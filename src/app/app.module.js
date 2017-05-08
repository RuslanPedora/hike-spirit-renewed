"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/http");
var common_1 = require("@angular/common");
var angular_2_local_storage_1 = require("angular-2-local-storage");
var app_component_1 = require("./app.component");
var invitation_component_1 = require("hs_app/component-invitation/invitation.component");
var routing_module_1 = require("./routing.module");
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [platform_browser_1.BrowserModule,
            forms_1.FormsModule,
            routing_module_1.RoutingModule,
            http_1.HttpModule,
            angular_2_local_storage_1.LocalStorageModule.withConfig({
                prefix: 'hike-spirit',
                storageType: 'localStorage'
            })
        ],
        declarations: [app_component_1.ApplicationComponent, invitation_component_1.InvitationComponent],
        providers: [common_1.Location,
            { provide: common_1.LocationStrategy,
                useClass: common_1.HashLocationStrategy }
        ],
        bootstrap: [app_component_1.ApplicationComponent]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map