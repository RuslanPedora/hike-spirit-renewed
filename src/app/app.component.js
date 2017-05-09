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
//import { DataService }  from 'services/data.service';
var ApplicationComponent = (function () {
    //-----------------------------------------------------------------------------
    function ApplicationComponent(router) {
        this.router = router;
    }
    //-----------------------------------------------------------------------------
    ApplicationComponent.prototype.ngOnInit = function () {
        this.routerListener = this.router.events.subscribe(this.resizeOutlet);
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
        elementOutlet = document.getElementById('outlerDiv');
        elementContacts = document.getElementById('contactDiv');
        elementCopyRights = document.getElementById('copyright');
        elementPanelDiv = document.getElementById('panelDiv');
        if (event.url.indexOf('invitation') < 0) {
            elementOutlet.style.maxWidth = '1000px';
            elementContacts.style.maxWidth = '1000px';
            elementCopyRights.style.maxWidth = '1000px';
        }
        else {
            elementOutlet.style.maxWidth = 'none';
            elementContacts.style.maxWidth = 'none';
            elementCopyRights.style.maxWidth = 'none';
        }
        if (event.url.indexOf('item-list') >= 0) {
        }
        else {
        }
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
    __metadata("design:paramtypes", [router_1.Router])
], ApplicationComponent);
exports.ApplicationComponent = ApplicationComponent;
//# sourceMappingURL=app.component.js.map