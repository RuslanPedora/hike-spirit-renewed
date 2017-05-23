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
var http_1 = require("@angular/http");
var Subject_1 = require("rxjs/Subject");
require("rxjs/add/operator/toPromise");
var angular_2_local_storage_1 = require("angular-2-local-storage");
var order_row_1 = require("hs_core/order.row");
var DataService = (function () {
    //-----------------------------------------------------------------------------
    function DataService(http, localStorageService) {
        this.http = http;
        this.localStorageService = localStorageService;
        //-----------------------------------------------------------------------------
        this.itemPrefix = '_IT';
        //-----------------------------------------------------------------------------
        this.lastViewItems = [];
        this.maxViewItems = 5;
        this.compareItems = [];
        this.maxCompareItems = 5;
        this.orderRows = [];
        //-----------------------------------------------------------------------------
        this.basketEventEmitter = new Subject_1.Subject();
        this.basketEventSource = this.basketEventEmitter.asObservable();
        this.pathEventEmitter = new Subject_1.Subject();
        this.pathEventSource = this.pathEventEmitter.asObservable();
        this.hostUrl = window.location.origin;
        if (this.hostUrl.indexOf('localhost') >= 0) {
            this.hostUrl = this.hostUrl.replace('3000', '8081');
        }
        this.categoryUrl = this.hostUrl + '/getCategoryList';
        this.itemUrl = this.hostUrl + '/getItemList';
        this.newItemUrl = this.hostUrl + '/getNewItemList';
        this.carrierUrl = this.hostUrl + '/getCarrierList';
        this.itemPropertiesUrl = this.hostUrl + '/getItemProperties';
        this.comparedPropertiesUrl = this.hostUrl + '/getComparedProperties';
        this.categoryPathUrl = this.hostUrl + '/getCategoryPath';
        this.categoryTreeDataUrl = this.hostUrl + '/getCategoryTreeData';
        this.propertiesUrl = this.hostUrl + '/getProperties';
        this.restoreFromLocalStorage();
    }
    //-----------------------------------------------------------------------------
    DataService.prototype.getBasketTotal = function () {
        var result = 0;
        if (this.orderRows.length > 0)
            result = this.orderRows.map(function (element) { return element.total; }).reduce(function (total, sum) { return total + sum; });
        return result;
    };
    //-----------------------------------------------------------------------------
    DataService.prototype.getBasketRows = function () {
        return this.orderRows;
    };
    //-----------------------------------------------------------------------------
    DataService.prototype.addItemToBasket = function (item, fixedQuiantity) {
        var neededRow;
        neededRow = this.orderRows.findIndex(function (element) { return element.item.id == item.id; });
        if (neededRow < 0)
            this.orderRows.push(new order_row_1.OrderRow(item));
        else {
            if (fixedQuiantity == undefined)
                this.orderRows[neededRow].quantity++;
            else
                this.orderRows[neededRow].quantity = fixedQuiantity;
            if (this.orderRows[neededRow].quantity <= 0) {
                this.deleteItemToBasket(item);
                return;
            }
            this.orderRows[neededRow].total = this.orderRows[neededRow].quantity *
                this.orderRows[neededRow].item.discountPrice;
        }
        this.basketEventEmitter.next('');
        this.storeBasket();
    };
    //-----------------------------------------------------------------------------
    DataService.prototype.storeBasket = function () {
        this.localStorageService.set('hs_basket', JSON.stringify(this.orderRows));
    };
    //----------------------------------------------------------------------------
    DataService.prototype.restoreFromLocalStorage = function () {
        var restoredValue;
        restoredValue = this.localStorageService.get('hs_basket');
        try {
            this.orderRows = JSON.parse(restoredValue);
            if (this.orderRows == null)
                this.orderRows = [];
        }
        catch (error) {
        }
        this.basketEventEmitter.next('');
        restoredValue = this.localStorageService.get('hs_compareList');
        try {
            this.compareItems = JSON.parse(restoredValue);
            if (this.compareItems == null)
                this.compareItems = [];
        }
        catch (error) {
        }
        restoredValue = this.localStorageService.get('hs_viewList');
        try {
            this.lastViewItems = JSON.parse(restoredValue);
            if (this.lastViewItems == null)
                this.lastViewItems = [];
        }
        catch (error) {
        }
    };
    //-----------------------------------------------------------------------------
    DataService.prototype.deleteItemToBasket = function (item) {
        var neededRow;
        var discount;
        neededRow = this.orderRows.findIndex(function (element) { return element.item.id == item.id; });
        if (neededRow >= 0) {
            this.orderRows[neededRow].quantity--;
            if (this.orderRows[neededRow].quantity <= 0)
                this.orderRows.splice(neededRow, 1);
            else {
                this.orderRows[neededRow].total = this.orderRows[neededRow].quantity *
                    this.orderRows[neededRow].item.discountPrice;
            }
            this.basketEventEmitter.next('');
            this.storeBasket();
        }
    };
    //-----------------------------------------------------------------------------
    DataService.prototype.converRate = function (data) {
        var rate;
        var k;
        for (var i in data) {
            rate = data[i].rate;
            data[i].rateArray = [];
            for (var j = 0; j < 5; j++) {
                data[i].rateArray.push(rate >= 1 ? 1 : rate);
                rate = Math.max(0, rate - 1);
            }
            for (k in data[i].imageList) {
                data[i].imageList[k].shift = 100 * k;
                data[i].imageList[k].smallShift = 20 * k;
            }
        }
    };
    //-----------------------------------------------------------------------------
    DataService.prototype.getProperties = function (categoryId) {
        return this.http.get(this.propertiesUrl + '/?' + JSON.stringify({ 'categoryId': categoryId }))
            .toPromise()
            .then(function (response) { return response.json(); })
            .catch(function (error) {
            return console.log(error);
        });
    };
    //-----------------------------------------------------------------------------
    DataService.prototype.getCategoryList = function () {
        return this.http.get(this.categoryUrl)
            .toPromise()
            .then(function (response) { return response.json(); })
            .catch(function (error) {
            return console.log(error);
        });
    };
    //-----------------------------------------------------------------------------
    DataService.prototype.getCategoryTreeData = function () {
        return this.http.get(this.categoryTreeDataUrl)
            .toPromise()
            .then(function (response) { return response.json(); })
            .catch(function (error) {
            return console.log(error);
        });
    };
    //-----------------------------------------------------------------------------
    DataService.prototype.getItemList = function (query) {
        return this.http.get(this.itemUrl + query)
            .toPromise()
            .then(function (response) { return response.json(); })
            .catch(function (error) {
            return console.log(error);
        });
    };
    //-----------------------------------------------------------------------------
    DataService.prototype.getCarrierList = function () {
        return this.http.get(this.carrierUrl)
            .toPromise()
            .then(function (response) { return response.json(); })
            .catch(function (error) {
            return console.log(error);
        });
    };
    //-----------------------------------------------------------------------------
    DataService.prototype.getItemProperties = function (query) {
        return this.http.get(this.itemPropertiesUrl + query)
            .toPromise()
            .then(function (response) { return response.json(); })
            .catch(function (error) {
            return console.log(error);
        });
    };
    //-----------------------------------------------------------------------------
    DataService.prototype.getNewItemList = function () {
        return this.http.get(this.newItemUrl)
            .toPromise()
            .then(function (response) { return response.json(); })
            .catch(function (error) {
            return console.log(error);
        });
    };
    //-----------------------------------------------------------------------------
    DataService.prototype.getComparedProperties = function (query) {
        return this.http.get(this.comparedPropertiesUrl + query)
            .toPromise()
            .then(function (response) { return response.json(); })
            .catch(function (error) {
            return console.log(error);
        });
    };
    //-----------------------------------------------------------------------------
    DataService.prototype.addToComapreItem = function (item) {
        var index;
        if (this.compareItems.findIndex(function (element) { return element.id == item.id; }) >= 0)
            return;
        if (this.compareItems.length == this.maxCompareItems) {
            this.compareItems.shift();
        }
        this.compareItems.push(item);
        this.localStorageService.set('hs_compareList', JSON.stringify(this.compareItems));
    };
    //-----------------------------------------------------------------------------
    DataService.prototype.removeToCompareList = function (item) {
        this.compareItems = this.compareItems.filter(function (element) { return element.id != item.id; });
        this.localStorageService.set('hs_compareList', JSON.stringify(this.compareItems));
    };
    //-----------------------------------------------------------------------------
    DataService.prototype.getCompareList = function () {
        return this.compareItems;
    };
    //-----------------------------------------------------------------------------
    DataService.prototype.addToViewItem = function (item) {
        var index;
        if (this.lastViewItems.findIndex(function (element) { return element.id == item.id; }) >= 0)
            return;
        if (this.lastViewItems.length == this.maxViewItems) {
            this.lastViewItems.shift();
        }
        this.lastViewItems.push(item);
        this.localStorageService.set('hs_viewList', JSON.stringify(this.lastViewItems));
    };
    //-----------------------------------------------------------------------------
    DataService.prototype.getLastViewedItems = function () {
        return this.lastViewItems;
    };
    //-----------------------------------------------------------------------------
    DataService.prototype.getItemPrefix = function () {
        return this.itemPrefix;
    };
    //-----------------------------------------------------------------------------
    DataService.prototype.buildPath = function (parObject) {
        var _this = this;
        var query = '/?';
        var pathArray;
        var categoryPath;
        if (parObject['mainImage'] != undefined)
            query += JSON.stringify({ 'categoryId': parObject.categoryId });
        else
            query += JSON.stringify({ 'categoryId': parObject.id });
        this.http.get(this.categoryPathUrl + query)
            .toPromise()
            .then(function (response) { return response.json(); })
            .catch(function (error) {
            return console.log(error);
        }).then(function (data) {
            categoryPath = data;
            if (parObject['mainImage'] != undefined)
                categoryPath.push(parObject);
            _this.pathEventEmitter.next(categoryPath);
        });
    };
    return DataService;
}());
DataService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http,
        angular_2_local_storage_1.LocalStorageService])
], DataService);
exports.DataService = DataService;
//# sourceMappingURL=data.service.js.map