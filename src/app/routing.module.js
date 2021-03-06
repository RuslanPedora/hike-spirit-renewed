"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var invitation_component_1 = require("hs_app/component-invitation/invitation.component");
var item_list_component_1 = require("hs_app/component-item-list/item.list.component");
var item_component_1 = require("hs_app/component-item/item.component");
var category_list_component_1 = require("hs_app/component-category-list/category.list.component");
var basket_component_1 = require("hs_app/component-basket/basket.component");
var compare_component_1 = require("hs_app/component-compare/compare.component");
var routes = [
    { path: '', redirectTo: '/invitation', pathMatch: 'full' },
    { path: 'invitation', component: invitation_component_1.InvitationComponent },
    { path: 'item-list', component: item_list_component_1.ItemListComponent },
    { path: 'item', component: item_component_1.ItemComponent },
    { path: 'category-list', component: category_list_component_1.CategoryListComponent },
    { path: 'basket', component: basket_component_1.BasketComponent },
    { path: 'compare-items', component: compare_component_1.CompareItems }
];
var RoutingModule = (function () {
    function RoutingModule() {
    }
    return RoutingModule;
}());
RoutingModule = __decorate([
    core_1.NgModule({
        imports: [router_1.RouterModule.forRoot(routes)],
        exports: [router_1.RouterModule]
    })
], RoutingModule);
exports.RoutingModule = RoutingModule;
//# sourceMappingURL=routing.module.js.map