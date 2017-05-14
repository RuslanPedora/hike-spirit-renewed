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
var item_1 = require("hs_core/item");
var ItemComponent = (function () {
    //-----------------------------------------------------------------------------
    function ItemComponent(router, activatedRoute, dataService) {
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.dataService = dataService;
        this.item = new item_1.Item();
        this.loupeFragment = '';
        this.mouseEntered = false;
        this.debugString = '';
    }
    //-----------------------------------------------------------------------------
    ItemComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.activatedRoute.queryParams.subscribe(function (queryParams) {
            var itemId = queryParams['itemId'];
            if (itemId != undefined) {
                _this.getItem(Number.parseInt(itemId));
            }
        });
    };
    //-----------------------------------------------------------------------------
    ItemComponent.prototype.getItem = function (itemId) {
        var _this = this;
        var tempList;
        JSON.stringify({ id_IT: itemId });
        this.dataService.getItemList('/?' + JSON.stringify({ id_IT: itemId }))
            .then(function (itemList) {
            tempList = itemList;
            _this.dataService.converRate(tempList);
            if (tempList.length > 0)
                _this.item = tempList[0];
        });
    };
    //-----------------------------------------------------------------------------
    ItemComponent.prototype.scrollBigImage = function (forward) {
        var imageIndex = 0;
        var i;
        var item = this.item;
        if (item.imageList.length <= 1)
            return;
        imageIndex = item.imageList.findIndex(function (element) { return element.shift == 0; });
        if (forward && imageIndex == item.imageList.length - 1) {
            for (i in item.imageList)
                item.imageList[i].shift = 100 * i;
        }
        else if (!forward && imageIndex == 0) {
            for (i in item.imageList)
                item.imageList[i].shift = -100 * (item.imageList.length - i - 1);
        }
        else {
            for (i in item.imageList)
                item.imageList[i].shift += forward ? -100 : 100;
        }
        this.scrollSmallImageList();
    };
    //-----------------------------------------------------------------------------
    ItemComponent.prototype.smallImageSelect = function (index) {
        var i;
        for (i in this.item.imageList) {
            this.item.imageList[i].shift = (i - index) * 100;
        }
        this.scrollSmallImageList();
    };
    //-----------------------------------------------------------------------------
    ItemComponent.prototype.scrollSmallImageList = function () {
        var i;
        var delta = 0;
        if (this.item.imageList[0].shift / 100 == 0) {
            delta = -40;
        }
        if (this.item.imageList[0].shift / 100 == -1) {
            delta = -20;
        }
        if (this.item.imageList.length > 5) {
            if (this.item.imageList[this.item.imageList.length - 1].shift == 0) {
                delta = 40;
            }
            if (this.item.imageList[this.item.imageList.length - 2].shift == 0) {
                delta = 20;
            }
        }
        for (i in this.item.imageList) {
            this.item.imageList[i].smallShift = 20 * this.item.imageList[i].shift / 100 + 40 + delta;
        }
    };
    //-----------------------------------------------------------------------------
    ItemComponent.prototype.mouseMove = function (event) {
        var newLeft;
        var newTop;
        if (this.mouseEntered) {
            newLeft = Math.min(event.offsetX, this.elementBigImage.clientWidth - this.elementLuope.clientWidth - 2);
            newTop = Math.min(event.offsetY, this.elementBigImage.clientHeight - this.elementLuope.clientHeight - 2);
            this.elementLuope.style.left = '' + newLeft + 'px';
            this.elementLuope.style.top = '' + newTop + 'px';
            this.elementLoupeFragment.style.left = '-' + (newLeft / this.elementBigImage.clientWidth * this.elementLoupeFragment.clientWidth) + 'px';
            this.elementLoupeFragment.style.top = '-' + (newTop / this.elementBigImage.clientHeight * this.elementLoupeFragment.clientHeight) + 'px';
        }
        //this.debugString = '' + this.elementLoupeFragment.style.left + '_' + this.elementLoupeFragment.style.top;
    };
    //-----------------------------------------------------------------------------
    ItemComponent.prototype.mouseEnter = function (event) {
        var zeroIndex;
        this.elementLuope = document.getElementById('loupe');
        this.elementBigImage = document.getElementById('bigImageDiv');
        this.elementLoupeImage = document.getElementById('loupeImageDiv');
        this.elementLoupeFragment = document.getElementById('loupeImageFragment');
        this.elementLoupeImage.style.display = 'block';
        //this.elementLuope.style.display = 'block';
        zeroIndex = this.item.imageList.findIndex(function (element) { return element.shift == 0; });
        this.loupeFragment = this.item.imageList[zeroIndex].bigImage;
        this.debugString = 'zzz_' + event.offsetX;
        this.mouseEntered = true;
    };
    //-----------------------------------------------------------------------------
    ItemComponent.prototype.mouseLeave = function (event) {
        this.elementLoupeImage.style.display = 'none';
        this.mouseEntered = false;
    };
    //-----------------------------------------------------------------------------
    ItemComponent.prototype.buyItem = function () {
        this.dataService.addItemToBasket(this.item);
    };
    return ItemComponent;
}());
ItemComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'item-component',
        templateUrl: './item.component.html',
        styleUrls: ['./item.component.css'],
    }),
    __metadata("design:paramtypes", [router_1.Router,
        router_1.ActivatedRoute,
        data_service_1.DataService])
], ItemComponent);
exports.ItemComponent = ItemComponent;
//# sourceMappingURL=item.component.js.map