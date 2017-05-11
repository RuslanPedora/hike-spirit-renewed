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
require("rxjs/add/operator/toPromise");
var DataService = (function () {
    //-----------------------------------------------------------------------------
    function DataService(http) {
        this.http = http;
        this.hostUrl = window.location.origin;
        if (this.hostUrl.indexOf('localhost') >= 0) {
            this.hostUrl = this.hostUrl.replace('3000', '8081');
        }
        this.categoryUrl = this.hostUrl + '/getCategoryList';
        this.itemUrl = this.hostUrl + '/getItemList';
    }
    //-----------------------------------------------------------------------------
    DataService.prototype.converRate = function (data) {
        var rate;
        for (var i in data) {
            rate = data[i].rate;
            data[i].rateArray = [];
            for (var j = 0; j < 5; j++) {
                data[i].rateArray.push(rate >= 1 ? 1 : rate);
                rate = Math.max(0, rate - 1);
            }
            for (var k in data[i].imageList) {
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
    return DataService;
}());
DataService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], DataService);
exports.DataService = DataService;
//# sourceMappingURL=data.service.js.map