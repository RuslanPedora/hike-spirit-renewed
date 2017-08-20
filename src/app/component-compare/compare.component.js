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
var CompareItems = (function () {
    //-----------------------------------------------------------------------------
    function CompareItems(router, activatedRoute, dataService) {
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.dataService = dataService;
        this.compareItems = [];
        this.compareProperties = [];
        this.collapse = true;
        this.compared = false;
    }
    //-----------------------------------------------------------------------------
    CompareItems.prototype.ngOnInit = function () {
        var _this = this;
        this.compareItems = this.dataService.getCompareList();
        this.activatedRoute.queryParams.subscribe(function (queryParams) {
            var collapse = queryParams['collapse'];
            _this.collapse = (collapse == undefined);
        });
    };
    //-----------------------------------------------------------------------------
    CompareItems.prototype.processItem = function (selectedItem) {
        var parObject = {};
        if (this.collapse) {
            parObject['collapse'] = false;
            this.router.navigate(['/compare-items'], { queryParams: parObject });
        }
        else {
            parObject['id'] = selectedItem.id;
            this.router.navigate(['/item'], { queryParams: parObject });
        }
    };
    //-----------------------------------------------------------------------------
    CompareItems.prototype.removeItem = function (selectedItem) {
        this.dataService.removeToCompareList(selectedItem);
        this.compareItems = this.dataService.getCompareList();
        this.compared = false;
    };
    //-----------------------------------------------------------------------------
    CompareItems.prototype.compare = function () {
        var _this = this;
        var queryString;
        var tempList = [];
        var itemId;
        var propertyName = '';
        var propertyValues = [];
        var tempArray = [];
        queryString = this.compareItems.map(function (el) { return "id=" + el.id; }).join('&');
        this.dataService.getComparedProperties(queryString).then(function (dataList) {
            tempList = dataList;
            var _loop_1 = function (i) {
                itemId = _this.compareItems[i].id;
                dataList.forEach(function (element) {
                    if (element.itemId == itemId)
                        element['sortKey'] = i;
                });
            };
            for (var i in _this.compareItems) {
                _loop_1(i);
            }
            dataList.sort(_this.comparator);
            _this.compareProperties = [];
            for (var i in dataList) {
                if (propertyName != dataList[i].propertyName) {
                    if (propertyName != '') {
                        tempArray = [];
                        tempArray.push(propertyName);
                        for (var j in propertyValues) {
                            tempArray.push(propertyValues[j]);
                        }
                        _this.compareProperties.push(tempArray);
                    }
                    propertyValues = [];
                    propertyName = dataList[i].propertyName;
                }
                propertyValues.push(dataList[i].value);
            }
            if (propertyName != '') {
                tempArray = [];
                tempArray.push(propertyName);
                for (var j in propertyValues) {
                    tempArray.push(propertyValues[j]);
                }
                _this.compareProperties.push(tempArray);
            }
        });
        this.compared = true;
    };
    //-----------------------------------------------------------------------------
    CompareItems.prototype.comparator = function (a, b) {
        if (a.propertyName < b.propertyName)
            return -1;
        else if (a.propertyName > b.propertyName)
            return 1;
        else
            return (a.sortKey < b.sortKey ? -1 : 1);
    };
    return CompareItems;
}());
CompareItems = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'compare-items',
        templateUrl: './compare.component.html',
        styleUrls: ['./compare.component.css'],
    }),
    __metadata("design:paramtypes", [router_1.Router,
        router_1.ActivatedRoute,
        data_service_1.DataService])
], CompareItems);
exports.CompareItems = CompareItems;
//# sourceMappingURL=compare.component.js.map