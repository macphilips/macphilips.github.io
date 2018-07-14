function LoadingView() {
    this._viewElement = htmlToElement(loadingTemplate);
}

LoadingView.prototype = {
    getViewElement: function () {
        return this._viewElement
    }
};