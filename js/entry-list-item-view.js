function EntryRowView(model) {
    var self = this;
    var html = '' + entryTableBodyRowTemplate.trim();
    html = formatter(html, model);
    this._view = htmlToElement(html);
    this._model = model;
    this.clickAction = new Event(this);
    this.checkBoxChange = new Event(this);
    this.updateView();
    // Update view when model changes
    this._model.valueChangeObserver.attach(function () {
        self.updateView();
    });
    // Dispatch onclick event when dropdown item is selected
    var dataActionElements = this._view.querySelectorAll('[tc-data-action]');
    for (i = 0; i < dataActionElements.length; i++) {
        (function () {
            var dataActionElement = dataActionElements[i];
            var dataValue = dataActionElement.getAttribute('tc-data-action');
            if (dataValue === 'view' || dataValue === 'edit' || dataValue === 'delete') {
                dataActionElement.onclick = function () {
                    self.clickAction.notify({action: dataValue, model: Object.assign({}, self._model)});
                    self.dismissDropDownMenu();
                }
            }
        })();
    }
    // Show dropdown
    var toggleAction = this._view.querySelector('[tc-data-action="dropdown-toggle"]');
    toggleAction.onclick = function (e) {
        self.showDropDownMenu(e)
    };
    // Dispatch onchange event when the checkbox changes
    var checkbox = this._view.querySelector('[tc-data-action="check"]');
    checkbox.onchange = function (e) {
        var index = checkbox.getAttribute('data-index');
        var id = checkbox.getAttribute('tc-data-id');
        var result = {position: index, id: id, checked: e.target.checked};
        self.checkBoxChange.notify(result);
    }
}

EntryRowView.prototype = {
    getModel: function () {
        return this._model;
    },
    setPosition: function (position) {
        var indexes = this._view.querySelectorAll('[data-index]');
        for (var i = 0; i < indexes.length; i++) {
            var index = indexes[i];
            index.setAttribute('data-index', position);
        }
    },
    getViewElement: function () {
        return this._view;
    },
    updateView: function () {
        var dataModelElements = this._view.querySelectorAll('[tc-data-model]');
        var i;
        for (i = 0; i < dataModelElements.length; i++) {
            var element = dataModelElements[i];
            var data = element.getAttribute('tc-data-model');
            element.innerHTML = getProperty(this._model, data);
        }
    },
    showDropDownMenu: function (e) {
        this.dismissDropDownMenu();
        e.toElement.nextElementSibling.classList.toggle("open");
        window.onclick = function (event) {
            if (!event.target.matches('.dropdown-toggle')) {
                var dropdowns = document.querySelectorAll('.dropdown-menu');
                var i;
                for (i = 0; i < dropdowns.length; i++) {
                    var openDropdown = dropdowns[i];
                    if (openDropdown.classList.contains('open')) {
                        openDropdown.classList.remove('open');
                    }
                }
            }
        }
    },
    dismissDropDownMenu: function () {
        var dropdownMenus = document.getElementsByClassName('dropdown-menu');
        for (i = 0; i < dropdownMenus.length; i++) {
            var openDropdown = dropdownMenus[i];
            if (openDropdown.classList.contains('open')) {
                openDropdown.classList.remove('open');
            }
        }
    },
    selectCheckBoxState: function (state) {
        var checkbox = this._view.querySelector('[tc-data-action="check"]');
        checkbox.checked = state;

    }
};