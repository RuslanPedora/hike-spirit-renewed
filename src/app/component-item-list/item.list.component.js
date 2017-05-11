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
var ItemListComponent = (function () {
    //-----------------------------------------------------------------------------
    function ItemListComponent(router, dataService) {
        this.router = router;
        this.dataService = dataService;
        this.itemList = [];
    }
    //-----------------------------------------------------------------------------
    ItemListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.dataService.getItemList('').then(function (itemList) {
            _this.itemList = itemList;
            _this.dataService.converRate(_this.itemList);
        });
    };
    //-----------------------------------------------------------------------------
    ItemListComponent.prototype.scrollImage = function (selectedItem, forward) {
        var imageIndex = 0;
        var i;
        if (selectedItem.imageList.length <= 1)
            return;
        imageIndex = selectedItem.imageList.findIndex(function (element) { return element.shift == 0; });
        if (forward && imageIndex == selectedItem.imageList.length - 1) {
            for (i in selectedItem.imageList)
                selectedItem.imageList[i].shift = 100 * i;
        }
        else if (!forward && imageIndex == 0) {
            for (i in selectedItem.imageList)
                selectedItem.imageList[i].shift = -100 * (selectedItem.imageList.length - i - 1);
        }
        else {
            for (i in selectedItem.imageList)
                selectedItem.imageList[i].shift += forward ? -100 : 100;
        }
    };
    //-----------------------------------------------------------------------------
    ItemListComponent.prototype.gotoItem = function (selectedItem) {
        this.router.navigate(['/item'], { queryParams: { itemId: selectedItem.id } });
    };
    return ItemListComponent;
}());
ItemListComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'item-list-component',
        templateUrl: './item.list.component.html',
        styleUrls: ['./item.list.component.css'],
    }),
    __metadata("design:paramtypes", [router_1.Router,
        data_service_1.DataService])
], ItemListComponent);
exports.ItemListComponent = ItemListComponent;
//# sourceMappingURL=item.list.component.js.map