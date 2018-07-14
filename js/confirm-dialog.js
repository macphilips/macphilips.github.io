function ConfirmDeleteEntryView() {
    this._viewElement = document.createElement('div');
    this._viewElement.innerHTML = deleteDialogTemple.trim();
    this.actionButtonClicked = new Event(this);
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