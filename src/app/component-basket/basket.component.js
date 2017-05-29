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
var carrier_1 = require("hs_core/carrier");
var BasketComponent = (function () {
    //-----------------------------------------------------------------------------
    function BasketComponent(router, dataService) {
        this.router = router;
        this.dataService = dataService;
        this.orderRows = [];
        this.carrierList = [];
        this.total = 0;
        this.totalPlusShipment = 0;
        this.selectedCarrier = new carrier_1.Carrier();
        this.paymentType = 'card';
        this.firstName = '';
        this.email = '';
        this.phoneNumber = '';
        this.comment = '';
    }
    //-----------------------------------------------------------------------------
    BasketComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.orderRows = this.dataService.getBasketRows();
        this.total = this.dataService.getBasketTotal();
        this.totalPlusShipment = this.total + this.selectedCarrier.cost;
        this.dataService.getCarrierList().then(function (carrierList) {
            _this.carrierList = carrierList;
            if (_this.carrierList.length > 0)
                _this.selectedCarrier = _this.carrierList[0];
            _this.totalPlusShipment = _this.total + _this.selectedCarrier.cost;
        });
    };
    //-----------------------------------------------------------------------------
    BasketComponent.prototype.selectCarrier = function (carrier) {
        this.selectedCarrier = carrier;
        this.totalPlusShipment = this.total + this.selectedCarrier.cost;
    };
    //-----------------------------------------------------------------------------
    BasketComponent.prototype.addItem = function (item, fixedQuiantity) {
        if (fixedQuiantity == undefined)
            this.dataService.addItemToBasket(item);
        else
            this.dataService.addItemToBasket(item, fixedQuiantity);
        this.total = this.dataService.getBasketTotal();
        this.totalPlusShipment = this.total + this.selectedCarrier.cost;
        this.orderRows = this.dataService.getBasketRows();
    };
    //-----------------------------------------------------------------------------
    BasketComponent.prototype.deleteItem = function (item) {
        this.dataService.deleteItemToBasket(item);
        this.total = this.dataService.getBasketTotal();
        this.totalPlusShipment = this.total + this.selectedCarrier.cost;
        this.orderRows = this.dataService.getBasketRows();
    };
    //-----------------------------------------------------------------------------
    BasketComponent.prototype.gotoItem = function (selectedItem) {
        var parObject = {};
        parObject['id' + this.dataService.getItemPrefix()] = selectedItem.id;
        this.router.navigate(['/item'], { queryParams: parObject });
    };
    //-----------------------------------------------------------------------------
    BasketComponent.prototype.postOrder = function () {
        var _this = this;
        var orderObject = {};
        orderObject['total'] = this.total;
        orderObject['totalPlusShipment'] = this.totalPlusShipment;
        orderObject['firstName'] = this.firstName;
        orderObject['secondName'] = '';
        orderObject['email'] = this.email;
        orderObject['phoneNumber'] = this.phoneNumber;
        orderObject['paymnetType'] = this.paymentType;
        orderObject['carrier'] = this.selectedCarrier;
        orderObject['orderRows'] = this.orderRows;
        orderObject['comment'] = this.comment;
        this.dataService.postOrder(orderObject).then(function (result) {
            return _this.dataService.showMessage('Your order #' + result['orderNumber'] + ' has been posted');
        });
    };
    //-----------------------------------------------------------------------------
    BasketComponent.prototype.setPaymentType = function (paymentType) {
        this.paymentType = paymentType;
    };
    return BasketComponent;
}());
BasketComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'basket-component',
        templateUrl: './basket.component.html',
        styleUrls: ['./basket.component.css'],
    }),
    __metadata("design:paramtypes", [router_1.Router,
        data_service_1.DataService])
], BasketComponent);
exports.BasketComponent = BasketComponent;
//# sourceMappingURL=basket.component.js.map