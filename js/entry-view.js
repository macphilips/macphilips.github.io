function CreateEntryView(model, action) {
    this._viewElement = document.createElement('div');
    this._viewElement.innerHTML = createEntryTemplate.trim();
    var textArea = this._viewElement.querySelector('textarea');

    var i, config = {title: 'Create New Diary Entry'};
    if (action) {
        if (action === 'view') {
            textArea.setAttribute('readonly', 'readonly');
            config.title = 'View Diary Entry'
        } else if (action === 'edit') {
            config.title = 'Edit Diary Entry'
        }
    }

    var dataModelElements = this._viewElement.querySelectorAll('[tc-data-model]');
    for (i = 0; i < dataModelElements.length; i++) {
        var element = dataModelElements[i];
        var data = element.getAttribute('tc-data-model');
        element.innerHTML = getProperty(config, data);
    }
    //
    if (model && model.content) {
        textArea.value = model.content;
    }
    var okButton = this._viewElement.querySelector('[tc-data-action="save"]');
    var self = this;
    okButton.onclick = function () {
        // todo delete model from server
        if (self.resultCallback) {

        }
        if (self.modalView) {
            self.modalView.dismiss();
        }

    }
}

CreateEntryView.prototype = {
    getViewElement: function () {
        return this._viewElement;
    },
};