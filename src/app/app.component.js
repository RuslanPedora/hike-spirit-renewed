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
var category_1 = require("hs_core/category");
var category_node_1 = require("hs_core/category.node");
var property_1 = require("hs_core/property");
var ApplicationComponent = (function () {
    //-----------------------------------------------------------------------------
    function ApplicationComponent(router, activatedRoute, dataService, location) {
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.dataService = dataService;
        this.location = location;
        this.total = 0;
        this.categoryPath = [];
        this.categoryNodes = [];
        this.propertyList = [];
        this.selectedProperties = [];
        this.selectedCategory = 0;
        this.paramsToParse = undefined;
        this.message = '';
        this.messageShown = false;
        this.colWidth = 200;
        this.mainAreaWidth = 1000;
        this.lowPrice = 0;
        this.highPrice = 0;
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
        this.messageListener = this.dataService.messageSource.subscribe(function (message) { return _this.showMessage(message); });
        this.activatedRoute.queryParams.subscribe(function (queryParams) {
            var categoryIdPar = queryParams['categoryId'];
            if (categoryIdPar != undefined) {
                _this.dataService.buildPath({ id: Number.parseInt(categoryIdPar) });
                _this.selectedCategory = categoryIdPar;
                if (_this.selectedProperties.length == 0) {
                    _this.paramsToParse = queryParams;
                    _this.lowPrice = 0;
                    _this.highPrice = 0;
                    _this.dataService.getProperties(categoryIdPar).then(function (data) { return _this.fillPropertyList(data); });
                    var lowPrice = queryParams['lowPrice' + _this.dataService.getItemPrefix()];
                    if (lowPrice != undefined)
                        _this.lowPrice = lowPrice;
                    var highPrice = queryParams['highPrice' + _this.dataService.getItemPrefix()];
                    if (highPrice != undefined)
                        _this.highPrice = highPrice;
                }
            }
            else {
                _this.selectedCategory = 0;
                _this.propertyList = [];
                _this.selectedProperties = [];
                _this.lowPrice = 0;
                _this.highPrice = 0;
            }
        });
        this.dataService.getCategoryTreeData().then(function (treeData) {
            _this.categoryNodes = _this.buildCategoryTree(treeData, 0);
            _this.resizeSubmenu();
        });
        this.total = this.dataService.getBasketTotal();
    };
    //-----------------------------------------------------------------------------
    ApplicationComponent.prototype.ngAfterContentInit = function () {
        this.onResize(undefined);
    };
    //-----------------------------------------------------------------------------
    ApplicationComponent.prototype.ngAfterViewInit = function () {
    };
    //-----------------------------------------------------------------------------
    ApplicationComponent.prototype.ngAfterViewChecked = function () {
    };
    //-----------------------------------------------------------------------------
    ApplicationComponent.prototype.ngOnDestroy = function () {
        this.routerListener.unsubscribe();
        this.basketListener.unsubscribe();
        this.pathListener.unsubscribe();
        this.messageListener.unsubscribe();
    };
    //-----------------------------------------------------------------------------
    ApplicationComponent.prototype.showMessage = function (message) {
        var element;
        var _this;
        this.message = message;
        this.messageShown = true;
    };
    //-----------------------------------------------------------------------------
    ApplicationComponent.prototype.hideMessage = function () {
        this.messageShown = false;
    };
    //-----------------------------------------------------------------------------
    ApplicationComponent.prototype.toggleFilter = function (property, value) {
        var tempArray = [value];
        var tempProperty = new property_1.Property(property.id, property.name, tempArray);
        var neededPropertry;
        neededPropertry = this.selectedProperties.find(function (element) { return element.id == property.id; });
        if (value.selected) {
            neededPropertry.values = neededPropertry.values.filter(function (element) { return element.value != value.value; });
            if (neededPropertry.values.length == 0)
                this.selectedProperties = this.selectedProperties.filter(function (element) { return element.id != neededPropertry.id; });
        }
        else {
            if (neededPropertry == undefined)
                this.selectedProperties.push(tempProperty);
            else
                neededPropertry.values.push(value);
        }
        value.selected = !value.selected;
        this.filterByPropertis();
    };
    //--------------------------+---------------------------------------------------
    ApplicationComponent.prototype.cleanSelectedValue = function (selectedProperty, selectedValue) {
        var neededPropertry;
        var neededValue;
        neededPropertry = this.selectedProperties.find(function (element) { return element.id == selectedProperty.id; });
        if (neededPropertry != undefined) {
            neededPropertry.values = neededPropertry.values.filter(function (element) { return element.value != selectedValue.value; });
            if (neededPropertry.values.length == 0)
                this.selectedProperties = this.selectedProperties.filter(function (element) { return element.id != neededPropertry.id; });
        }
        neededPropertry = this.propertyList.find(function (element) { return element.id == selectedProperty.id; });
        if (neededPropertry != undefined) {
            neededValue = neededPropertry.values.find(function (element) { return element.value == selectedValue.value; });
            neededValue.selected = false;
        }
        this.filterByPropertis();
    };
    //--------------------------+---------------------------------------------------
    ApplicationComponent.prototype.fillPropertyList = function (data) {
        var id = 0;
        var name = '';
        var tempArray;
        var tempId = 0;
        var valueRef = '';
        var propertryRef;
        this.propertyList = [];
        for (var i in data) {
            if (id != data[i].id) {
                if (id != 0) {
                    this.propertyList.push(new property_1.Property(id, name, tempArray));
                }
                tempArray = [];
                id = data[i].id;
                name = data[i].name;
            }
            tempArray.push({ value: data[i].value, selected: false });
        }
        if (id != 0) {
            this.propertyList.push(new property_1.Property(id, name, tempArray));
        }
        if (this.paramsToParse != undefined) {
            for (var property in this.paramsToParse) {
                if (property.indexOf('propertyId') >= 0) {
                    tempId = Number.parseInt(this.paramsToParse[property]);
                    propertryRef = this.propertyList.find(function (element) { return element.id == tempId; });
                    if (this.paramsToParse['value' + property.replace('propertyId', '')] instanceof Array)
                        tempArray = this.paramsToParse['value' + property.replace('propertyId', '')];
                    else {
                        tempArray = [];
                        tempArray.push(this.paramsToParse['value' + property.replace('propertyId', '')]);
                    }
                    for (var i in tempArray) {
                        valueRef = propertryRef.values.find(function (element) { return element.value == tempArray[i]; });
                        this.toggleFilter(propertryRef, valueRef);
                    }
                }
            }
            this.paramsToParse = undefined;
        }
    };
    //-----------------------------------------------------------------------------
    ApplicationComponent.prototype.buildCategoryTree = function (treeData, level, parentId) {
        var tempArray = [];
        var nodeArray = [];
        var currentNode;
        if (level == 0) {
            tempArray = treeData.filter(function (element) { return element.parentId == 0; });
            for (var i in tempArray) {
                currentNode = new category_node_1.CategoryNode(new category_1.Category(tempArray[i].categoryId, tempArray[i].categoryName, ''), tempArray[i].itemCount, level);
                currentNode.nodes = this.buildCategoryTree(treeData, level + 1, currentNode.category.id);
                currentNode.itemCount = this.calculateItemCount(currentNode);
                nodeArray.push(currentNode);
            }
            return nodeArray;
        }
        else {
            tempArray = treeData.filter(function (element) { return element.parentId == parentId; });
            for (var i in tempArray) {
                currentNode = new category_node_1.CategoryNode(new category_1.Category(tempArray[i].categoryId, tempArray[i].categoryName, ''), tempArray[i].itemCount, level);
                currentNode.nodes = this.buildCategoryTree(treeData, level + 1, currentNode.category.id);
                nodeArray.push(currentNode);
            }
            return nodeArray;
        }
    };
    //-----------------------------------------------------------------------------
    ApplicationComponent.prototype.calculateItemCount = function (categoryNode) {
        var result = 0;
        for (var i in categoryNode.nodes)
            result += this.calculateItemCount(categoryNode.nodes[i]);
        if (categoryNode.nodes.length > 0)
            categoryNode.itemCount = result;
        else
            result = categoryNode.itemCount;
        return result;
    };
    //-----------------------------------------------------------------------------
    ApplicationComponent.prototype.goPath = function (pathElelement) {
        var parObject = {};
        if (pathElelement.hasOwnProperty('mainImage')) {
        }
        else {
            parObject['categoryId'] = pathElelement.id;
            this.router.navigate(['/item-list'], { queryParams: parObject });
        }
    };
    //-----------------------------------------------------------------------------
    ApplicationComponent.prototype.onResize = function (event) {
        var homeButton;
        var forwardButton;
        var searchInput;
        var basketBar;
        var elementPanelDiv;
        searchInput = document.getElementById('searchInput');
        homeButton = document.getElementById('homeNavButton');
        basketBar = document.getElementById('basketBar');
        elementPanelDiv = document.getElementById('panelDiv');
        if (elementPanelDiv != undefined)
            this.mainAreaWidth = elementPanelDiv.clientWidth;
        forwardButton = document.getElementById('forwardNavButton');
        searchInput.style.width = (forwardButton.offsetLeft + forwardButton.clientWidth - homeButton.offsetLeft - 40 + 1).toString() + 'px';
        this.resizeSubmenu();
    };
    //-----------------------------------------------------------------------------
    ApplicationComponent.prototype.resizeSubmenu = function () {
        var maxSubmenuCol = 0;
        this.mainAreaWidth = Math.min(window.innerWidth, 1000);
        maxSubmenuCol = Math.floor(this.mainAreaWidth / this.colWidth);
        for (var i in this.categoryNodes) {
            this.categoryNodes[i].submenuWidth = Math.min(maxSubmenuCol, this.categoryNodes[i].nodes.length) * this.colWidth;
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
        var elementCategoryTree;
        elementOutlet = document.getElementById('outlerDiv');
        elementContacts = document.getElementById('contactDiv');
        elementCopyRights = document.getElementById('copyright');
        elementPanelDiv = document.getElementById('panelDiv');
        elementBGImage = document.getElementById('mainBgImage');
        elementCategoryTree = document.getElementById('categoryTree');
        if (event.url.indexOf('invitation') >= 0 || event.url == '/') {
            elementOutlet.style.maxWidth = '100%';
            elementContacts.style.maxWidth = '100%';
            elementCopyRights.style.maxWidth = '100%';
            elementPanelDiv.style.display = 'none';
            elementCategoryTree.style.display = 'none';
            this.categoryPath = [];
        }
        else {
            elementOutlet.style.maxWidth = '1000px';
            elementContacts.style.maxWidth = '1000px';
            elementCopyRights.style.maxWidth = '1000px';
            elementPanelDiv.style.display = 'block';
            if (event.url.indexOf('category-list') >= 0 || event.url == '/')
                elementCategoryTree.style.display = 'none';
            else
                elementCategoryTree.style.display = 'block';
        }
        if (event.url.indexOf('category-list') >= 0) {
            elementBGImage.style.opacity = '.8';
        }
        else {
            elementBGImage.style.opacity = '1';
        }
        if (event.url.indexOf('item-list') < 0) {
            this.selectedProperties = [];
            this.propertyList = [];
            this.showFilter = false;
        }
        else
            this.showFilter = true;
    };
    //-----------------------------------------------------------------------------
    ApplicationComponent.prototype.scrollTop = function () {
        window.scrollTo(0, 0);
    };
    //-----------------------------------------------------------------------------
    ApplicationComponent.prototype.subscribe = function () {
        this.showMessage('You have subscribed');
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
    ApplicationComponent.prototype.forward = function () {
        this.location.forward();
    };
    //-----------------------------------------------------------------------------
    ApplicationComponent.prototype.gotoCategory = function (selectedCategory) {
        var parObject = {};
        parObject['categoryId'] = selectedCategory.id;
        this.router.navigate(['/item-list'], { queryParams: parObject });
        this.selectedProperties = [];
        this.propertyList = [];
    };
    //-----------------------------------------------------------------------------
    ApplicationComponent.prototype.filterByPropertis = function () {
        var parObject = {};
        var tempArray = [];
        parObject['categoryId'] = this.selectedCategory;
        if (this.lowPrice > 0)
            parObject['lowPrice' + this.dataService.getItemPrefix()] = this.lowPrice;
        if (this.highPrice > 0)
            parObject['highPrice' + this.dataService.getItemPrefix()] = this.highPrice;
        for (var i in this.selectedProperties) {
            tempArray = [];
            for (var j in this.selectedProperties[i].values)
                tempArray.push(this.selectedProperties[i].values[j].value);
            parObject['propertyId' + i] = this.selectedProperties[i].id;
            parObject['value' + i] = tempArray;
        }
        this.router.navigate(['/item-list'], { queryParams: parObject });
    };
    //-----------------------------------------------------------------------------
    ApplicationComponent.prototype.cleanLowPrice = function () {
        this.lowPrice = 0;
        this.filterByPropertis();
    };
    //-----------------------------------------------------------------------------
    ApplicationComponent.prototype.cleanHighPrice = function () {
        this.highPrice = 0;
        this.filterByPropertis();
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