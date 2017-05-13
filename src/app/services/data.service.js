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
        this.orderRows = [];
        //-----------------------------------------------------------------------------
        this.basketEventEmitter = new Subject_1.Subject();
        this.basketEventSource = this.basketEventEmitter.asObservable();
        this.hostUrl = window.location.origin;
        if (this.hostUrl.indexOf('localhost') >= 0) {
            this.hostUrl = this.hostUrl.replace('3000', '8081');
        }
        this.categoryUrl = this.hostUrl + '/getCategoryList';
        this.itemUrl = this.hostUrl + '/getItemList';
        this.carrierUrl = this.hostUrl + '/getCarrierList';
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
            }
        }
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
    return DataService;
}());
DataService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http,
        angular_2_local_storage_1.LocalStorageService])
], DataService);
exports.DataService = DataService;
//# sourceMappingURL=data.service.js.map