function MainView() {
    this._view = document.getElementById('main');
}

MainView.prototype = {
    addChild: function (content) {
        //this._view.innerHTML = '';
        this._view.appendChild(content);
    },
    removeChild: function (content) {
        this._view.removeChild(content);
    }
};

function MainViewController(mainView) {
    this._mainView = mainView;
    this.modalService = new ModalService();
    this.adapter = new EntryTableViewAdapter(this.modalService);
    this.view = new EntryTableView(this.adapter);
    this.entryTableController = new EntryTableController(this.view, this.modalService);
}

MainViewController.prototype = {
    initialize: function () {
        if (typeof(Storage) !== "undefined") {
            // Code for localStorage/sessionStorage.
            if (!!localStorage.authenticationToken) {
                var self = this;
                let loadingView = new LoadingView();
                this._mainView.addChild(this.view.getViewElement());
                this._mainView.addChild(loadingView.getViewElement());
                this.entryTableController.initialize();
                this.entryTableController.onReady.attach(function () {
                    self._mainView.removeChild(loadingView.getViewElement());
                })
            } else {
                window.location.replace('signin.html')
            }
        } else {
            // Sorry! No Web Storage support..
        }
    }
};

document.addEventListener("DOMContentLoaded", function (event) {
    var main = new MainViewController(new MainView());
    main.initialize();
});
