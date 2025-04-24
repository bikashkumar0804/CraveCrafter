$(document).ready(function () {
    // Function to check if username or email exists
    function checkEmail(email) {
        return new Promise((resolve, reject) => {
            fetch('http://localhost:3000/users')
                .then(response => response.json())
                .then(users => {
                    const user = users.find(user => user.email === email || user.username === email);
                    if (user) {
                        resolve(user);
                    } else {
                        reject('Username or Email not found.');
                    }
                })
                .catch(() => {
                    reject('Error fetching user data.');
                });
        });
    }

    // Function to validate credentials
    function validateLogin(email, password) {
        return new Promise((resolve, reject) => {
            fetch('http://localhost:3000/users')
                .then(response => response.json())
                .then(users => {
                    const user = users.find(user =>
                        (user.email === email || user.username === email) && user.password === password
                    );
                    if (user) {
                        resolve(user);
                    } else {
                        reject('Please enter correct password.');
                    }
                })
                .catch(() => {
                    reject('Error fetching user data.');
                });
        });
    }

    // Form submission (supports button click and Enter key)
    $('#loginForm').on('submit', function (e) {
        e.preventDefault();

        const email = $('input[name="username"]').val();
        const password = $('input[name="password"]').val();

        // Remove any previous error messages
        $(".errorMessage, .errorMessage2").remove();

        // Input validations
        if (!email && !password) {
            $('.input-box1').append('<div class="errorMessage">Please enter your username or email.</div>');
            $('.input-box2').append('<div class="errorMessage2">Please enter your password.</div>');
            return;
        }

        if (!email) {
            $('.input-box1').append('<div class="errorMessage">Please enter your username or email.</div>');
            return;
        }

        if (!password) {
            $('.input-box2').append('<div class="errorMessage2">Please enter your password.</div>');
            return;
        }

        // Check if user exists and validate login
        checkEmail(email)
            .then(() => {
                return validateLogin(email, password);
            })
            .then(user => {
                // Store in localStorage
                localStorage.setItem('userEmail', user.email);
                localStorage.setItem('username', user.username);
                // Redirect after successful login
                window.location.href = 'index.html';
            })
            .catch(error => {
                if (error.includes("password")) {
                    $('.input-box2').append(`<div class="errorMessage">${error}</div>`);
                } else {
                    $('.input-box1').append(`<div class="errorMessage">${error}</div>`);
                }
            });
    });

    // Remove error messages on input
    $('input[name="username"]').on('input', function () {
        $('.errorMessage').remove();
    });

    $('input[name="password"]').on('input', function () {
        $('.errorMessage2').remove();
    });
});
