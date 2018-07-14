function RowItemModel(obj) {
    var self = this;
    this.valueChangeObserver = new Event(this);
    Object.keys(obj).forEach(function (key) {
        var value;
        Object.defineProperty(self, key, {
            set: function (newValue) {
                value = newValue;
                self.valueChangeObserver.notify();
            },
            get: function () {
                return value;
            },
            enumerable: true
        });
    });
    Object.keys(obj).forEach(function (key) {
        self[key] = obj[key];
    });
}

RowItemModel.prototype = {
    bindPropToView: function (prop, view) {
    }
};