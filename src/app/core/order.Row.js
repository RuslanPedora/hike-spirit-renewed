"use strict";
var OrderRow = (function () {
    function OrderRow(item) {
        this.item = item;
        this.quantity = 1;
        this.total = this.quantity * this.item.discountPrice;
    }
    return OrderRow;
}());
exports.OrderRow = OrderRow;
//# sourceMappingURL=order.row.js.map