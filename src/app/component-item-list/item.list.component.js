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
    function ItemListComponent(router, activatedRoute, dataService) {
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.dataService = dataService;
        this.itemList = [];
    }
    //-----------------------------------------------------------------------------
    ItemListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.activatedRoute.queryParams.subscribe(function (queryParams) { return _this.getItemList(queryParams); });
        window.scrollTo(0, 0);
    };
    //-----------------------------------------------------------------------------
    ItemListComponent.prototype.getItemList = function (params) {
        var _this = this;
        var queryString = '';
        var _loop_1 = function (paramName) {
            queryString += queryString === '' ? '' : '&';
            if (params[paramName] instanceof Array) {
                queryString += params[paramName].map(function (el) { return paramName + "=" + el; }).join('&');
            }
            else {
                queryString += paramName + "=" + params[paramName];
            }
        };
        for (var paramName in params) {
            _loop_1(paramName);
        }
        this.dataService.getItemList(queryString).then(function (itemList) {
            _this.itemList = itemList;
            _this.dataService.converRate(_this.itemList);
        });
    };
    //-----------------------------------------------------------------------------
    ItemListComponent.prototype.scrollImage = function (selectedItem, forward) {
        var imageIndex = 0;
        var i;
        if (selectedItem.imageList.length <= 1) {
            return;
        }
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
        this.router.navigate(['/item'], { queryParams: { id: selectedItem.id } });
    };
    //-----------------------------------------------------------------------------
    ItemListComponent.prototype.buyItem = function (selectedItem) {
        this.dataService.addItemToBasket(selectedItem);
    };
    //-----------------------------------------------------------------------------
    ItemListComponent.prototype.sortItemList = function (sortKey) {
        this.itemList.sort(this[sortKey]);
    };
    //-----------------------------------------------------------------------------
    ItemListComponent.prototype.nameUp = function (a, b) {
        return (a.name < b.name ? -1 : 1);
    };
    //-----------------------------------------------------------------------------
    ItemListComponent.prototype.nameDown = function (a, b) {
        return (a.name > b.name ? -1 : 1);
    };
    //-----------------------------------------------------------------------------
    ItemListComponent.prototype.priceUp = function (a, b) {
        return (a.discountPrice < b.discountPrice ? -1 : 1);
    };
    //-----------------------------------------------------------------------------
    ItemListComponent.prototype.priceDown = function (a, b) {
        return (a.discountPrice > b.discountPrice ? -1 : 1);
    };
    //-----------------------------------------------------------------------------
    ItemListComponent.prototype.rateUp = function (a, b) {
        return (a.rate < b.rate ? -1 : 1);
    };
    //-----------------------------------------------------------------------------
    ItemListComponent.prototype.rateDown = function (a, b) {
        return (a.rate > b.rate ? -1 : 1);
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
        router_1.ActivatedRoute,
        data_service_1.DataService])
], ItemListComponent);
exports.ItemListComponent = ItemListComponent;
//# sourceMappingURL=item.list.component.js.map