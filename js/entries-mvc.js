var modalBoxTemplate = `
<div id="modal-box" class="modal">
    <div class="modal-content"></div>
</div>`;

var deleteDialogTemple = `
        <div class="modal-header">
            <span class="modal-header-title" role="heading">
                Confirm Delete
            </span>
            <span tc-data-dismiss="modal"  class="close-btn close" role="button" tabindex="0" aria-label="Close"></span>
        </div>
        <div class="modal-body">This action delete entry from database. Are you sure you want to continue?
        </div>
        <div class="modal-footer">
            <button tc-data-action="ok" name="ok" class="btn-ok">OK</button>
            <button tc-data-dismiss="cancel"  name="cancel">Cancel</button>
        </div>`;
var entryHeadTemplate = `
            <tr class="header-filter">
                <td colspan="3">
                    Diary Entries
                </td>
                <td></td>
                <td>
                    <a  id="addEntry" title="Add Entry" class="action-btn add m-0" role="button"
                          aria-label="Add"></a>
                </td>

            </tr>
            <tr>
                <td>
                    <label onclick="selectAllEntry();" class="custom-checkbox">
                        <input type="checkbox">
                        <span class="check-mark"></span>
                    </label>
                </td>
                <td class="content-width">Content</td>
                <td>Date</td>
                <td>Last Modified</td>
                <td></td>
            </tr>`;
var entryRowTemplate = `
            <tr data-index="{{position}}">
                <td><label class="custom-checkbox">
                        <input tc-data-bind="check" type="checkbox">
                        <span class="check-mark"></span>
                    </label></td>
                <td><p class="content" tc-data-model="content">This is a sample content</p></td>
                <td tc-data-model="dateCreated">date created sample</td>
                <td tc-data-model="lastModified">last modified</td>
                <td>
                    <div>
                        <div class="dropdown">
                            <a data-index="0"  tc-data-action="dropdown-toggle" class="dropdown-toggle"></a>
                            <ul class="dropdown-menu">
                                <li><a tc-data-action="view" href="javascript:void(0);">View</a></li>
                                <li><a tc-data-action="edit" href="javascript:void(0);">Edit</a></li>
                                <li><a tc-data-action="delete" href="javascript:void(0);">Delete</a></li>
                            </ul>
                        </div>
                    </div>
                </td>
            </tr>`;

var createEntryTemplate = `
    <form>    
        <div class="modal-header">
            <span tc-data-model="title" class="modal-header-title" role="heading">
               Create New Diary Entry
            </span>
            <span tc-data-dismiss="modal"  class="close-btn close" role="button" tabindex="0" aria-label="Close"></span>
        </div>         
        <hr>        
        <div class="modal-body"> 
        <div class="create-entry"><textarea placeholder="Dear Diary, " id="entry" rows="20" autofocus></textarea></div>                
        </div> 
        <div class="modal-footer">
            <button tc-data-action="save" type="submit" class="btn-save">Save</button>
            <button tc-data-dismiss="cancel" type="button" class="btn-cancel">Cancel</button>
        </div>
    </form>
`;

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

/**/
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

/**/

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
    var html = '' + entryRowTemplate.trim();
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
            table_head.innerHTML = entryHeadTemplate;
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

function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

/*

function ListModel(items) {
    this._items = items;
    this._selectedIndex = -1;

    this.itemAdded = new Event(this);
    this.itemRemoved = new Event(this);
    this.selectedIndexChanged = new Event(this);
}

ListModel.prototype = {
    getItems: function () {
        return [].concat(this._items);
    },

    addItem: function (item) {
        this._items.push(item);
        this.itemAdded.notify({
            item: item
        });
    },

    removeItemAt: function (index) {
        var item;

        item = this._items[index];
        this._items.splice(index, 1);
        this.itemRemoved.notify({
            item: item
        });
        if (index === this._selectedIndex) {
            this.setSelectedIndex(-1);
        }
    },

    getSelectedIndex: function () {
        return this._selectedIndex;
    },

    setSelectedIndex: function (index) {
        var previousIndex;
        previousIndex = this._selectedIndex;
        this._selectedIndex = index;
        this.selectedIndexChanged.notify({
            previous: previousIndex
        });
    }
};

function ListController(model, view) {
    this._model = model;
    this._view = view;

    var _this = this;

    this._view.listModified.attach(function (sender, args) {
        _this.updateSelected(args.index);
    });
    this._view.addButtonClicked.attach(function () {
        _this.addItem();
    });
    this._view.delButtonClicked.attach(function () {
        _this.delItem();
    });
}

ListController.prototype = {
    addItem: function () {
        var item = window.prompt('Add item:', '');
        if (item) {
            this._model.addItem(item);
        }
    },
    delItem: function () {
        var index;

        index = this._model.getSelectedIndex();
        if (index !== -1) {
            this._model.removeItemAt(this._model.getSelectedIndex());
        }
    },
    updateSelected: function (index) {
        this._model.setSelectedIndex(index);
    }
};

function ListView(model, elements) {
    this._model = model;
    this._elements = elements;

    this.listModified = new Event(this);
    this.addButtonClicked = new Event(this);
    this.delButtonClicked = new Event(this);

    var _this = this;

    // attach model listeners
    this._model.itemAdded.attach(function () {
        _this.rebuildList();
    });
    this._model.itemRemoved.attach(function () {
        _this.rebuildList();
    });

    // attach listeners to HTML controls
    this._elements.list.onchange = function (e) {
        e = e || window.event;
        _this.listModified.notify({
            index: e.target.selectedIndex
        });
    };
    this._elements.addButton.onclick = function () {
        _this.addButtonClicked.notify();
    };
    this._elements.delButton.onclick = function () {
        _this.delButtonClicked.notify();
    };
}

ListView.prototype = {
    show: function () {
        this.rebuildList();
    },
    rebuildList: function () {
        var list, items, key;
        list = this._elements.list;
        list.innerHTML = '';
        items = this._model.getItems();
        for (key in items) {
            if (items.hasOwnProperty(key)) {
                list.appendChild(document.createElement('option'))
                    .appendChild(document.createTextNode(items[key]))
            }
        }
        this._model.setSelectedIndex(-1);
    }
};
 */

document.addEventListener("DOMContentLoaded", function (event) {
    var modalService = new ModalService();
    var adapter = new EntryTableViewAdapter(modalService);
    var view = new EntryTableView(adapter);
    var entryTableController = new EntryTableController(view, modalService);
    view.render();
    /*var serverData  = [
        {
            id: '83ubfc',
            content: sampleContent,
            lastModified: 'Mar 12, 2018 18:45',
            dateCreated: 'Mar 12, 2018 08:00'
        },
        {
            id: 'yuscws',
            content: 'Ranioncvi iondvo viohnsldmnvioh wvh j cvb 9hikjvp ubavi bkjcv ',
            lastModified: 'Mar 16, 2018 18:45',
            dateCreated: 'Mar 22, 2018 08:00'
        },
        {
            id: '738ifj',
            content: 'Ranioncvi iondvo viohnsldmnvioh wvh j cvb 9hikjvp ubavi bkjcv ',
            lastModified: 'Mar 16, 2018 18:45',
            dateCreated: 'Mar 22, 2018 08:00'
        },
        {
            id: 'cjol09',
            content: 'Ranioncvi iondvo viohnsldmnvioh wvh j cvb 9hikjvp ubavi bkjcv ',
            lastModified: 'Mar 16, 2018 18:45',
            dateCreated: 'Mar 22, 2018 08:00'
        }];*/
    loadEntries(function (serverData) {
        var models = [];
        for (var i = 0; i < serverData.length; i++) {
            models.push(new RowItemModel(serverData[i]));
        }
        adapter.addItems(models);
    });
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