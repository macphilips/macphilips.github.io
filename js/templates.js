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
        <div tc-data-model="message" class="modal-body">This action delete entry from database. Are you sure you want to continue?
        </div>
        <div class="modal-footer">
            <button tc-data-action="ok" name="ok" class="btn-ok">OK</button>
            <button tc-data-dismiss="cancel"  name="cancel">Cancel</button>
        </div>`;
var entryTableHeadTemplate = `
            <tr class="header-filter">
                <td colspan="3">
                    Diary Entries
                </td>
                <td></td>
                <td>
                    <div class="action-btn-container">                
                        <a id="deleteEntry" title="Delete Entries" class="action-btn delete m-0 hide" role="button"
                          aria-label="Add"></a>
                        <a id="addEntry" title="Add Entry" class="action-btn add m-0" role="button"
                          aria-label="Add"></a>
                    </div>
                </td>

            </tr>
            <tr>
                <td>
                    <label class="custom-checkbox">
                        <input tc-data-action="check" type="checkbox">
                        <span class="check-mark"></span>
                    </label>
                </td>
                <td class="content-width">Content</td>
                <td>Date</td>
                <td>Last Modified</td>
                <td></td>
            </tr>`;
var entryTableBodyRowTemplate = `
            <tr>
                <td><label class="custom-checkbox">
                        <input data-index="" tc-data-id="{{id}}" tc-data-action="check" type="checkbox">
                        <span class="check-mark"></span>
                    </label></td>
                <td><p class="content" tc-data-model="content">This is a sample content</p></td>
                <td tc-data-model="dateCreated">date created sample</td>
                <td tc-data-model="lastModified">last modified</td>
                <td>
                    <div>
                        <div class="dropdown">
                            <a data-index=""  tc-data-action="dropdown-toggle" class="dropdown-toggle"></a>
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
var loadingTemplate = `
    <div class="loading-container">
        <div class="loading-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    </div>`;