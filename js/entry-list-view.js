function EntryTableView(adapter) {
    this._adapter = adapter;
    this._view = document.createElement('div');
    this._view.setAttribute('id','entries');
    this.itemToRemove = [];
    this.selectAll = new Event(this);
    this.addButtonClicked = new Event(this);
    this.deleteButtonClicked = new Event(this);
    var self = this;
    this._adapter.registerChangeObserver(function () {
        self.render();
    });
}

EntryTableView.prototype = {
    showDeleteButton: function () {
        var deleteButton = this._view.querySelector('#deleteEntry');
        if (this.itemToRemove.length > 0) {
            deleteButton.style.visibility = 'visible';
            deleteButton.style.opacity = '1';
        } else {
            deleteButton.style.visibility = 'hidden';
            deleteButton.style.opacity = '0';
        }

    },
    render: function () {
        var self = this;
        var adapter = this._adapter;
        this._view.innerHTML = '';
        var viewContainer = document.createElement('div');
        var table = document.createElement('table');
        var table_head = document.createElement('thead');
        table_head.innerHTML = entryTableHeadTemplate;
        var addButton = table_head.querySelector('#addEntry');
        var deleteButton = table_head.querySelector('#deleteEntry');
        var selectAllInput = table_head.querySelector('[tc-data-action="check"]');
        addButton.onclick = function () {
            self.addButtonClicked.notify({});
        };
        deleteButton.onclick = function () {
            self.deleteButtonClicked.notify({items: self.itemToRemove});
        };
        selectAllInput.onchange = function () {
            var checked = selectAllInput.checked;
            self.itemToRemove = [];
            if (checked) {
                for (var i = 0; i < adapter.getSize(); i++) {
                    var viewItem = adapter.getViewItem(i).getModel();
                    self.itemToRemove.push(viewItem);
                }
            }
            self.showDeleteButton();
            self.selectAll.notify({checkedState: checked});
        };
        var table_body = document.createElement('tbody');
        if (adapter.getSize() > 0) {
            for (var i = 0; i < adapter.getSize(); i++) {
                (function () {
                    var viewItem = adapter.getViewItem(i);
                    viewItem.checkBoxChange.attach(function (conext, args) {
                        if (args.checked) {
                            var items = self.itemToRemove.filter(function (item) {
                                return item.id === args.id;
                            });
                            if (items.length === 0) {
                                self.itemToRemove.push(viewItem.getModel());
                            }
                        } else {
                            self.itemToRemove = self.itemToRemove.filter(function (item) {
                                return item.id !== args.id;
                            });
                        }

                        selectAllInput.checked = self.itemToRemove.length === adapter.getSize();

                        self.showDeleteButton();

                    });
                    table_body.appendChild(viewItem.getViewElement());
                })();
            }
        } else {

        }
        table.appendChild(table_head);
        table.appendChild(table_body);
        viewContainer.appendChild(table);
        this._view.appendChild(viewContainer);
        viewContainer.classList.add('container');
        viewContainer.classList.add('entry-table');
    },
    getAdapter: function () {
        return this._adapter;
    },
    getViewElement: function () {
        return this._view;
    }
};

function EntryTableViewAdapter(modalService) {
    this._data = [];
    this._viewItems = [];
    this._modalService = modalService;
    this._notifyChangeObserver = new Event(this);
}

EntryTableViewAdapter.prototype = {
    getSize: function () {
        return (this._viewItems) ? this._viewItems.length : 0;
    },
    getViewItem: function (position) {
        var viewItem = this._viewItems[position];
        var item = viewItem.getModel();
        viewItem.setPosition(position);
        return viewItem;
    },
    addItem: function (item) {
        var view = new EntryRowView(item);
        var self = this;
        view.clickAction.attach(function (source, arg) {
            if (arg && arg.action === 'delete') {
                var view = new ConfirmDeleteEntryView();
                view.actionButtonClicked.attach(function (context, args) {
                    if (args.action === 'ok') {
                        //todo delete item from server and render list
                    }
                });
                self._modalService.open(view);
            } else {
                self._modalService.open(new CreateEntryView(arg.model, arg.action))
            }
        });
        this._data.push(item);
        this._viewItems.push(view);
        this.notifyChangeObservers();
    },
    addItems: function (items) {
        for (var i = 0; i < items.length; i++) {
            this.addItem(items[i]);
        }
        this.notifyChangeObservers();
    },
    removeItems: function (items) {
        var temp = this._viewItems;
        this._data = [];
        this._viewItems = [];
        for (var i = 0; i < temp.length; i++) {
            var found = false;
            var model = temp[i].getModel();
            for (var j = 0; j < items.length; j++) {
                if (model.id === items[j].id) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                this._viewItems.push(temp[i]);
                this._data.push(model);
            }
        }
        this.notifyChangeObservers()
    },
    notifyChangeObservers: function () {
        this._notifyChangeObserver.notify();

    },
    registerChangeObserver: function (observer) {
        this._notifyChangeObserver.attach(observer);
    },
    selectAllItem: function (state) {
        for (var i = 0; i < this._viewItems.length; i++) {
            var viewItem = this._viewItems[i];
            viewItem.selectCheckBoxState(state);
        }
    }
};

function EntryTableController(view, modalService) {
    this._view = view;
    var self = this;
    view.addButtonClicked.attach(function () {
        var component = new CreateEntryView();
        component.modalView = modalService.getModalView();
        modalService.open(component);
    });
    view.selectAll.attach(function (context, args) {
        self._view.getAdapter().selectAllItem(args.checkedState);
    });
    view.deleteButtonClicked.attach(function (context, args) {
        var component = new ConfirmDeleteEntryView();
        component.modalView = modalService.getModalView();
        modalService.open(component);
        component.actionButtonClicked.attach(function () {
            // todo delete items from server
            console.log('action ok deleting items from server =>', args.items);
            self._view.getAdapter().removeItems(args.items);
        })
    });
    this.onReady = new Event(this);
}

EntryTableController.prototype = {
    initialize: function () {
        var adapter = this._view.getAdapter();
        var self = this;
        loadEntries(function (result) {
            var models = [];
            for (var i = 0; i < result.length; i++) {
                models.push(new RowItemModel(result[i]));
            }
            adapter.addItems(models);
            self.onReady.notify();
        });
        this._view.render();
    }
};