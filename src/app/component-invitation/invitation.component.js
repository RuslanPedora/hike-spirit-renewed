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
var InvitationComponent = (function () {
    //-----------------------------------------------------------------------------
    function InvitationComponent(router, dataService) {
        this.router = router;
        this.dataService = dataService;
        this.categoryList = [];
        this.itemList = [];
    }
    //-----------------------------------------------------------------------------
    InvitationComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.dataService.getCategoryList().then(function (categoryList) {
            _this.categoryList = categoryList;
            if (_this.categoryList.length >= 4)
                _this.categoryList = _this.categoryList.slice(0, 4);
        });
        this.dataService.getNewItemList().then(function (itemList) { return _this.itemList = itemList; });
    };
    //-----------------------------------------------------------------------------
    InvitationComponent.prototype.gotoItemList = function (selectedCategory) {
        var parObject = {};
        parObject['categoryId' + this.dataService.getItemPrefix()] = selectedCategory.id;
        this.router.navigate(['/item-list'], { queryParams: parObject });
    };
    //-----------------------------------------------------------------------------
    InvitationComponent.prototype.gotoItem = function (selectedItem) {
        var parObject = {};
        parObject['id' + this.dataService.getItemPrefix()] = selectedItem.id;
        this.router.navigate(['/item'], { queryParams: parObject });
    };
    //-----------------------------------------------------------------------------
    InvitationComponent.prototype.onResize = function (event) {
    };
    //-----------------------------------------------------------------------------
    InvitationComponent.prototype.scrollDown = function () {
        window.scrollTo(0, document.body.scrollHeight);
    };
    //-----------------------------------------------------------------------------
    InvitationComponent.prototype.articles = function () {
        alert('Articles will be added a little bit later...');
    };
    //-----------------------------------------------------------------------------
    InvitationComponent.prototype.scrollToQuote = function () {
        window.scrollTo(0, document.getElementById('pageintro').offsetTop);
    };
    return InvitationComponent;
}());
InvitationComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'invitaion-component',
        templateUrl: './invitation.component.html',
        styleUrls: ['./invitation.component.css'],
    }),
    __metadata("design:paramtypes", [router_1.Router,
        data_service_1.DataService])
], InvitationComponent);
exports.InvitationComponent = InvitationComponent;
//# sourceMappingURL=invitation.component.js.map