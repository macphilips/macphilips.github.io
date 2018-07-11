function Event(sender) {
    this._sender = sender;
    this._listeners = [];
}

Event.prototype = {
    attach: function (listener) {
        this._listeners.push(listener);
    },
    notify: function (args) {
        var index;
        for (index = 0; index < this._listeners.length; index += 1) {
            this._listeners[index](this._sender, args);
        }
    }
};

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

    getModalView: function () {
        return this._modalView;
    }
};

function ConfirmDeleteEntryView(model) {
    this._viewElement = document.createElement('div');
    this._viewElement.innerHTML = deleteDialogTemple.trim();
    var okButton = this._viewElement.querySelector('[tc-data-action="ok"]');
    var self = this;
    okButton.onclick = function () {
        // todo delete model from server
        console.log('deleting entry from server');
        if (self.modalView)
            self.modalView.dismiss();
    }

}

ConfirmDeleteEntryView.prototype = {
    getViewElement: function () {
        return this._viewElement;
    }
};

function CreateEntryView(model, action) {
    this._viewElement = document.createElement('div');
    this._viewElement.innerHTML = createEntryTemplate.trim();
    //
    var textArea = this._viewElement.querySelector('textarea');
    if (model && model.content) {
        textArea.value = model.content;
    }
    if (action && action === 'view') {
        textArea.setAttribute('readonly', 'readonly');
    }
    var okButton = this._viewElement.querySelector('[tc-data-action="save"]');
    var self = this;
    okButton.onclick = function () {
        // todo delete model from server
        console.log('deleting entry from server');
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
    }
};

function RowItemModel(obj) {
    var self = this;
    this.valueChangeObserver = new Event(this);
    Object.keys(obj).forEach(function (key) {
        var value;
        Object.defineProperty(self, key, {
            set: function (newValue) {
                // console.log('key => ', key);
                // console.log('newValue => ', newValue);
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

function EntryRowView(model) {
    var self = this;
    var html = '' + entryTableBodyRowTemplate.trim();
    html = formatter(html, model);
    this._view = htmlToElement(html);
    this._model = model;
    this.clickAction = new Event(this);
    this.updateView();
    this._model.valueChangeObserver.attach(function () {
        self.updateView();
    });

    var dataActionElements = this._view.querySelectorAll('[tc-data-action]');
    for (i = 0; i < dataActionElements.length; i++) {
        (function () {
            var dataActionElement = dataActionElements[i];
            var dataValue = dataActionElement.getAttribute('tc-data-action');
            if (dataValue !== 'dropdown-toggle') {
                dataActionElement.onclick = function () {
                    console.log('action => ', dataValue);
                    self.clickAction.notify({action: dataValue, model: Object.assign({}, self._model)});
                    self.dismissDropDownMenu();
                }
            }
        })();
    }

    var toggleAction = this._view.querySelector('[tc-data-action="dropdown-toggle"]');
    toggleAction.onclick = function (e) {
        self.showDropDownMenu(e)
    };
}

EntryRowView.prototype = {
    getViewElement: function () {
        return this._view;
    },
    getPropertyView: function (context, contextStr) {
        var splitArray = contextStr.split(".");
        var currentContext = context;
        while (splitArray.length) {
            var item = splitArray.shift().trim();
            if (typeof(currentContext) === "object" && item in currentContext)
                currentContext = currentContext[item];
            else
                return;
        }
        return currentContext;
    },
    updateView: function () {
        var dataModelElements = this._view.querySelectorAll('[tc-data-model]');
        var i;
        for (i = 0; i < dataModelElements.length; i++) {
            var element = dataModelElements[i];
            var data = element.getAttribute('tc-data-model');
            element.innerHTML = this.getPropertyView(this._model, data);
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
    }
};

function EntryTableView(adapter) {
    this._adapter = adapter;
    this._view = document.getElementById('entries');
    this.selectAll = new Event(this);
    this.addButtonClicked = new Event(this);
    this.deleteButton = new Event(this);
    var self = this;
    this._adapter.registerChangeObserver(function () {
        self.render();
    });
}

EntryTableView.prototype = {
    render: function () {
        var adapter = this._adapter;
        if (adapter.getSize() > 0) {
            var viewContainer = document.createElement('div');
            var table = document.createElement('table');
            var table_head = document.createElement('thead');
            var table_body = document.createElement('tbody');

            this._view.innerHTML = '';
            table_head.innerHTML = entryTableHeadTemplate;
            var addButton = table_head.querySelector('#addEntry');
            var self = this;
            addButton.onclick = function () {
                console.log('button clicked');
                self.addButtonClicked.notify({});
            };
            viewContainer.classList.add('entry-table');
            for (var i = 0; i < adapter.getSize(); i++) {
                table_body.appendChild(adapter.getViewElement(i));
            }
            table.appendChild(table_head);
            table.appendChild(table_body);
            viewContainer.appendChild(table);
            this._view.appendChild(viewContainer);
        }
    },
    getAdapter: function () {
        return this._adapter;
    }
};

function EntryTableViewAdapter(modalService) {
    this._data = [];
    this._modalService = modalService;
    this._notifyChangeObserver = new Event(this);
}

EntryTableViewAdapter.prototype = {
    getSize: function () {
        return (this._data) ? this._data.length : 0;
    },
    getItem: function (position) {
        return this._data[position];
    },
    getViewElement: function (position) {
        var item = this.getItem(position);
        item.position = position;
        var view = new EntryRowView(item);
        var self = this;
        view.clickAction.attach(function (source, arg) {
            console.log('source => ', source);
            console.log('argument => ', arg);
            if (arg && arg.action === 'delete') {
                self._modalService.open(new ConfirmDeleteEntryView(arg.model))
            } else {
                self._modalService.open(new CreateEntryView(arg.model, arg.action))
            }

        });
        return view.getViewElement();
    },
    addItem: function (item) {
        this._data.push(item);
        this.notifyChangeObservers();
    },
    addItems: function (items) {
        for (var i = 0; i < items.length; i++) {
            this.addItem(items[i]);
        }
        this.notifyChangeObservers();
    },
    notifyChangeObservers: function () {
        this._notifyChangeObserver.notify();

    },
    registerChangeObserver: function (observer) {
        this._notifyChangeObserver.attach(observer);
    }
};

function EntryTableController(view, modalService) {
    this._view = view;
    view.addButtonClicked.attach(function () {
        console.log('opening modal box');
        var component = new CreateEntryView();
        component.modalView = modalService.getModalView();
        modalService.open(component);
    })
}

EntryTableController.prototype = {
    initialize: function () {
        var adapter = this._view.getAdapter();
        loadEntries(function (serverData) {
            var models = [];
            for (var i = 0; i < serverData.length; i++) {
                models.push(new RowItemModel(serverData[i]));
            }
            adapter.addItems(models);
        });
        this._view.render();
    }
}

function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}


document.addEventListener("DOMContentLoaded", function (event) {
    var main = new MainViewController();
    main.initialize();
});

function loadEntries(callback) {
    setTimeout(function () {
        var xhttp = null;
        if (window.XMLHttpRequest) {
            // code for modern browsers
            xhttp = new XMLHttpRequest();
        } else {
            // code for old IE browsers
            xhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                callback(JSON.parse(this.responseText));
            }
        };
        xhttp.open("GET", "asset/entries.json", true);
        xhttp.send();
    }, 0)
}

function MainViewController() {
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
                this.entryTableController.initialize();
            } else {
                window.location.replace('signin.html')
            }
        } else {
            // Sorry! No Web Storage support..
        }
    }
};


var formatter = (function () {
    // var regEx = /{([^{]*?)}/g;
    var regEx = /{{([^{]*?)}}/g;
    var requiresSubstitution = function (str) {
        return regEx.test(str);
    };

    var getSubstituteValue = function (context) {
        return function (regexMatch, placeholder) {
            // console.log('regexMatch => ',regexMatch);
            // console.log('placeholder => ',placeholder);
            var splitArray = placeholder.split(".");
            var currentContext = context;
            while (splitArray.length) {
                var item = splitArray.shift().trim();
                if (typeof(currentContext) === "object" && item in currentContext)
                    currentContext = currentContext[item];
                else
                    return;
            }
            return currentContext;
        };
    };

    return function (input, context) {
        if (requiresSubstitution(input)) {
            input = input.replace(regEx, getSubstituteValue(context));
        }
        return input
    };
})();