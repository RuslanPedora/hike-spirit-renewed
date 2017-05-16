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
var ApplicationComponent = (function () {
    //-----------------------------------------------------------------------------
    function ApplicationComponent(router, dataService) {
        this.router = router;
        this.dataService = dataService;
        this.total = 0;
    }
    //-----------------------------------------------------------------------------
    ApplicationComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.routerListener = this.router.events.subscribe(this.resizeOutlet);
        this.basketListener = this.dataService.basketEventSource.subscribe(function (eventValue) {
            return _this.total = _this.dataService.getBasketTotal();
        });
        this.total = this.dataService.getBasketTotal();
    };
    //-----------------------------------------------------------------------------
    ApplicationComponent.prototype.onResize = function (event) {
    };
    //-----------------------------------------------------------------------------
    ApplicationComponent.prototype.gotoBasket = function () {
        this.router.navigate(['/basket']);
    };
    //-----------------------------------------------------------------------------
    ApplicationComponent.prototype.resizeOutlet = function (event) {
        var elementOutlet;
        var elementContacts;
        var elementCopyRights;
        var elementPanelDiv;
        var elementBGImage;
        elementOutlet = document.getElementById('outlerDiv');
        elementContacts = document.getElementById('contactDiv');
        elementCopyRights = document.getElementById('copyright');
        elementPanelDiv = document.getElementById('panelDiv');
        elementBGImage = document.getElementById('mainBgImage');
        if (event.url.indexOf('invitation') >= 0 || event.url == '/') {
            elementOutlet.style.maxWidth = '100%';
            elementContacts.style.maxWidth = '100%';
            elementCopyRights.style.maxWidth = '100%';
            elementPanelDiv.style.display = 'none';
        }
        else {
            elementOutlet.style.maxWidth = '1000px';
            elementContacts.style.maxWidth = '1000px';
            elementCopyRights.style.maxWidth = '1000px';
            elementPanelDiv.style.display = 'block';
        }
        if (event.url.indexOf('category-list') >= 0) {
            elementBGImage.style.opacity = '.8';
        }
        else {
            elementBGImage.style.opacity = '1';
        }
    };
    //-----------------------------------------------------------------------------
    ApplicationComponent.prototype.scrollTop = function () {
        window.scrollTo(0, 0);
    };
    //-----------------------------------------------------------------------------
    ApplicationComponent.prototype.subscribe = function () {
        alert('You have subscribed');
    };
    return ApplicationComponent;
}());
ApplicationComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'app-component',
        templateUrl: './app.component.html',
        styleUrls: ['./app.component.css'],
        host: {
            '(window:resize)': 'onResize($event)'
        }
    }),
    __metadata("design:paramtypes", [router_1.Router,
        data_service_1.DataService])
], ApplicationComponent);
exports.ApplicationComponent = ApplicationComponent;
//# sourceMappingURL=app.component.js.map