/*document.addEventListener("DOMContentLoaded", function (event) {
    var modal = document.getElementById('modal-box');
    var close = document.getElementsByClassName("close")[0];
    close.onclick = function () {
        modal.style.display = "none";
    };
    var dropdownMenu = document.querySelectorAll('.dropdown-menu');
    window.onclick = function (event) {

        if (event.target === modal) {
            modal.style.display = "none";
        }

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
});


function selectAllEntry() {
}


function createEntry() {
}
*/


function toggleMenu(event) {
    var dropdownMenus = document.getElementsByClassName("dropdown-menu");
    for (i = 0; i < dropdownMenus.length; i++) {
        var openDropdown = dropdownMenus[i];
        if (openDropdown.classList.contains('open')) {
            openDropdown.classList.remove('open');
        }
    }
    event.toElement.nextElementSibling.classList.toggle("open");
}

var formatter = (function () {
    // var regEx = /{([^{]*?)}/g;
    var regEx = /{{([^{]*?)}}/g;
    var checkForSubstitutors = function (str) {
        return regEx.test(str);
    };

    var getSubstitueValue = function (context) {
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
        if (checkForSubstitutors(input)) {
            input = input.replace(regEx, getSubstitueValue(context));
        }
        return input
    };
})();