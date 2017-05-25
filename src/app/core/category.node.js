"use strict";
var CategoryNode = (function () {
    function CategoryNode(category, itemCount, level) {
        this.itemCount = 0;
        this.level = 0;
        this.nodes = [];
        this.category = category;
        this.level = level;
        this.itemCount = itemCount;
        this.nodes = [];
        this.nodeOffset = 0;
    }
    return CategoryNode;
}());
exports.CategoryNode = CategoryNode;
//# sourceMappingURL=category.node.js.map