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
var common_1 = require("@angular/common");
var data_service_1 = require("hs_services/data.service");
var ApplicationComponent = (function () {
    //-----------------------------------------------------------------------------
    function ApplicationComponent(router, activatedRoute, dataService, location) {
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.dataService = dataService;
        this.location = location;
        this.total = 0;
        this.categoryPath = [];
    }
    //-----------------------------------------------------------------------------
    ApplicationComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.routerListener = this.router.events.subscribe(function (event) {
            _this.categoryPath = [];
            _this.resizeOutlet(event);
        });
        this.basketListener = this.dataService.basketEventSource.subscribe(function (eventValue) {
            return _this.total = _this.dataService.getBasketTotal();
        });
        this.pathListener = this.dataService.pathEventSource.subscribe(function (eventValue) {
            return _this.categoryPath = eventValue;
        });
        this.activatedRoute.queryParams.subscribe(function (queryParams) {
            var categoryIdPar = queryParams['categoryId' + _this.dataService.getItemPrefix()];
            if (categoryIdPar != undefined) {
                _this.dataService.buildPath({ id: Number.parseInt(categoryIdPar) });
            }
        });
        this.total = this.dataService.getBasketTotal();
    };
    //-----------------------------------------------------------------------------
    ApplicationComponent.prototype.ngAfterContentInit = function () {
        this.onResize(undefined);
    };
    //-----------------------------------------------------------------------------
    ApplicationComponent.prototype.ngOnDestroy = function () {
        this.routerListener.unsubscribe();
        this.basketListener.unsubscribe();
        this.pathListener.unsubscribe();
    };
    //-----------------------------------------------------------------------------
    ApplicationComponent.prototype.goPath = function (pathElelement) {
        var parObject = {};
        if (pathElelement['mainImage'] != undefined) {
        }
        else {
            parObject['categoryId' + this.dataService.getItemPrefix()] = pathElelement.id;
            this.router.navigate(['/item-list'], { queryParams: parObject });
        }
    };
    //-----------------------------------------------------------------------------
    ApplicationComponent.prototype.onResize = function (event) {
        var homeButton;
        var forwardButton;
        var searchInput;
        searchInput = document.getElementById('searchInput');
        if (window.innerWidth <= 749) {
            homeButton = document.getElementById('homeNavButton');
            forwardButton = document.getElementById('forwardNavButton');
            searchInput.style.width = (forwardButton.offsetLeft + forwardButton.clientWidth - homeButton.offsetLeft - 40).toString() + 'px';
        }
        else {
            searchInput.style.width = '318px';
        }
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
    //-----------------------------------------------------------------------------
    ApplicationComponent.prototype.searchItem = function (searchKey) {
        var parObject = {};
        var keyAsNumber;
        parObject['name' + this.dataService.getItemPrefix()] = searchKey;
        keyAsNumber = Number.parseInt(searchKey);
        if (!isNaN(keyAsNumber))
            parObject['searchId' + this.dataService.getItemPrefix()] = searchKey;
        if (searchKey == '')
            this.router.navigate(['/item-list']);
        else
            this.router.navigate(['/item-list'], { queryParams: parObject });
    };
    //-----------------------------------------------------------------------------
    ApplicationComponent.prototype.scrollDown = function () {
        window.scrollTo(0, document.body.scrollHeight);
    };
    //-----------------------------------------------------------------------------
    ApplicationComponent.prototype.back = function () {
        this.location.back();
    };
    //-----------------------------------------------------------------------------
    ApplicationComponent.prototype.forwar = function () {
        this.location.forward();
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
        router_1.ActivatedRoute,
        data_service_1.DataService,
        common_1.Location])
], ApplicationComponent);
exports.ApplicationComponent = ApplicationComponent;
//# sourceMappingURL=app.component.js.map