function ModalView() {
    this._viewElement = htmlToElement(modalBoxTemplate);
    this.modalViewContent = null;
    this.onclickEvent = new Event(this);
    this.onDismissEvent = new Event(this);
    var self = this;
    this._viewElement.onclick = function (event) {
        self.onclickEvent.notify(event);
    }
}

ModalView.prototype = {
    setContent: function (modalContent) {
        var content = this._viewElement.querySelector('.modal-content');
        content.innerHTML = '';
        content.appendChild(modalContent);
        this.modalViewContent = modalContent;
        var self = this;
        var dismissButtons = this._viewElement.querySelectorAll('[tc-data-dismiss]');
        for (var i = 0; i < dismissButtons.length; i++) {
            var dismissButton = dismissButtons[i];
            dismissButton.onclick = function () {
                self.onDismissEvent.notify();
                self.dismiss();
            }
        }
    },

    getViewElement: function () {
        return this._viewElement;
    },

    dismiss: function () {
        this.onDismissEvent.notify();
        document.body.removeChild(this.getViewElement());
    }
};

function ModalService() {
    this._modalView = new ModalView();
}

ModalService.prototype = {
    open: function (content) {
        var modal = this._modalView.getViewElement();
        modal.style.display = 'block';
        content.modalView = this._modalView;
        this._modalView.setContent(content.getViewElement());
        document.body.appendChild(modal);
    },
    onDismiss: function (callback) {
        this._modalView.onDismissEvent.attach(callback);
    },

    getModalView: function () {
        return this._modalView;
    }
};