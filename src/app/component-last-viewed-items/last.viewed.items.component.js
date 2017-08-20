"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var data_service_1 = require("hs_services/data.service");
var LastViewedItems = (function () {
    //-----------------------------------------------------------------------------
    function LastViewedItems(router, dataService) {
        this.router = router;
        this.dataService = dataService;
        this.lastViewedItems = [];
    }
    //-----------------------------------------------------------------------------
    LastViewedItems.prototype.ngOnInit = function () {
        this.lastViewedItems = this.dataService.getLastViewedItems();
    };
    //-----------------------------------------------------------------------------
    LastViewedItems.prototype.gotoItem = function (selectedItem) {
        this.router.navigate(['/item'], { queryParams: { id: selectedItem.id } });
    };
    return LastViewedItems;
}());
LastViewedItems = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'last-viewed-items',
        templateUrl: './last.viewed.items.component.html',
        styleUrls: ['./last.viewed.items.component.css'],
    }),
    __metadata("design:paramtypes", [router_1.Router,
        data_service_1.DataService])
], LastViewedItems);
exports.LastViewedItems = LastViewedItems;
//# sourceMappingURL=last.viewed.items.component.js.map