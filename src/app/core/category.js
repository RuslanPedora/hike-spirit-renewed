"use strict";
var Category = (function () {
    function Category() {
        this.id = -1;
        this.name = '';
        this.image = '';
    }
    Category.prototype.Category = function (id, name, image) {
        this.id = id;
        this.name = name;
        this.image = image;
    };
    return Category;
}());
exports.Category = Category;
//# sourceMappingURL=category.js.map