function ConfirmDeleteEntryView(message) {
    this._viewElement = document.createElement('div');
    this._viewElement.innerHTML = deleteDialogTemple.trim();
    this.actionButtonClicked = new Event(this);

    var model = {message: 'This action delete entry from database. Are you sure you want to continue?'};
    if (message) {
        model.message = message;
    }

    var dataModelElements = this._viewElement.querySelectorAll('[tc-data-model]');
    var i;
    for (i = 0; i < dataModelElements.length; i++) {
        var element = dataModelElements[i];
        var data = element.getAttribute('tc-data-model');
        element.innerHTML = getProperty(model, data);
    }

    var okButton = this._viewElement.querySelector('[tc-data-action="ok"]');
    var cancelButton = this._viewElement.querySelector('[tc-data-dismiss="cancel"]');
    var self = this;
    okButton.onclick = function () {
        // todo delete model from server
        self.actionButtonClicked.notify({action: 'ok'});
        if (self.modalView)
            self.modalView.dismiss();
    };
    cancelButton.onclick = function () {
        self.actionButtonClicked.notify({action: 'cancel'});
    }

}

ConfirmDeleteEntryView.prototype = {
    getViewElement: function () {
        return this._viewElement;
    }
};