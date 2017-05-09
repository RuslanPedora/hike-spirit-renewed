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
var CategoryListComponent = (function () {
    //-----------------------------------------------------------------------------
    function CategoryListComponent(router, dataService) {
        this.router = router;
        this.dataService = dataService;
        this.categoryList = [];
    }
    //-----------------------------------------------------------------------------
    CategoryListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.dataService.getCategoryList().then(function (categoryList) { return _this.categoryList = categoryList; });
    };
    //-----------------------------------------------------------------------------
    CategoryListComponent.prototype.gotoItemList = function (selectedCategory) {
        this.router.navigate(['/item-list'], { queryParams: { category: selectedCategory.id } });
    };
    return CategoryListComponent;
}());
CategoryListComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'category-list-component',
        templateUrl: './category.list.component.html',
        styleUrls: ['./category.list.component.css'],
    }),
    __metadata("design:paramtypes", [router_1.Router,
        data_service_1.DataService])
], CategoryListComponent);
exports.CategoryListComponent = CategoryListComponent;
//# sourceMappingURL=category.list.component.js.map