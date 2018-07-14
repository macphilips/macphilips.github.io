function validateForm(form) {
    var valid = true;
    var inputForms = form.querySelectorAll('input');
    for (i = inputForms.length - 1; i >= 0; i--) {
        // If a field is empty...
        let inputForm = inputForms[i];
        let value = inputForm.value;

        if (inputForm.type !== 'password') value = value.trim();

        if (value === '') {
            // add an 'invalid' class to the field:
            inputForm.className += ' invalid';
            // and set the current valid status to false
            valid = false;
            inputForm.focus();
            inputForm.oninput = function (e) {
                e.target.classList.remove('invalid');
            }
        }
    }

    var matchPasswordElement = form.querySelector('#match-password');
    if (matchPasswordElement) {
        var passwordElement = form.querySelector('#password');
        if (matchPasswordElement.value !== passwordElement.value) {
            showAlert('Please input a matching password', 'error');
            valid = false;
        }
    }
    return valid;

}

function showAlert(msg, type) {
    var alert = document.getElementById('alert');
    if (!alert) return;
    alert.className = '';
    alert.classList.add('alert');
    alert.classList.add(type);
    var msgElement = alert.querySelector('.alert-msg');
    var closeElement = alert.querySelector('.close-btn');
    var closeHandler = function () {
        alert.style.display = 'none';
    };
    msgElement.innerHTML = msg;
    alert.style.display = 'block';

    closeElement.onclick = closeHandler;
    setTimeout(closeHandler, 8000);
}

function createAccount(e) {
    e.preventDefault();
    var form = document.getElementById('signupForm');
    if (validateForm(form)) {

    }
}

function signIn(e) {
    if (e) e.preventDefault();
    var form = document.getElementById('signinForm');
    if (validateForm(form)) {
        var formJson = toJSONString(form);
        // todo get authentication token from server
        localStorage.authenticationToken = formJson;
        window.location.replace('index.html');
    }
}

function send(url, formData) {

}

function toJSONString(form) {
    var obj = {};
    var elements = form.querySelectorAll('input, select, textarea');
    for (var i = 0; i < elements.length; ++i) {
        var element = elements[i];
        var name = element.name;
        var value = element.value;
        if (element.type === 'checkbox') {
            value = element.checked;
        }

        if (name) {
            obj[name] = value;
        }
    }
    return JSON.stringify(obj);
}


document.addEventListener('DOMContentLoaded', function (event) {

    var signinForm = document.getElementById('signinForm');
    if (signinForm) {
        signinForm.onsubmit = signIn;
    }
    var signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.onsubmit = createAccount;
    }
});