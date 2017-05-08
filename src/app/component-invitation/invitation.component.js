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
var InvitationComponent = (function () {
    //-----------------------------------------------------------------------------
    function InvitationComponent(router) {
        this.router = router;
        this.categoryList = [1, 2342, 3, 9909424];
        this.itemList = [1, 2, 3];
        this.brandList = [1, 2, 3, 4, 5];
    }
    //-----------------------------------------------------------------------------
    InvitationComponent.prototype.ngOnInit = function () {
    };
    //-----------------------------------------------------------------------------
    InvitationComponent.prototype.onResize = function (event) {
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
    __metadata("design:paramtypes", [router_1.Router])
], InvitationComponent);
exports.InvitationComponent = InvitationComponent;
//# sourceMappingURL=invitation.component.js.map