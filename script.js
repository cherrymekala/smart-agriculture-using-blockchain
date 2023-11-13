document.addEventListener('DOMContentLoaded', function() {
      var loginForm = document.getElementById('login-form');
      var errorMessage = document.getElementById('error-message');

      loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;

        // Validate email format using regular expression
        var emailFormat = /^\S+@\S+\.\S+$/;
        if (!emailFormat.test(username)) {
          displayError('Invalid email format. Please enter a valid email address.');
          return;
        }

        // Get existing registered users from localStorage
        var registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];

        // Find the user with the given email (username)
        var user = registeredUsers.find(function(u) {
          return u.email === username;
        });

        // Check if the user exists and password matches
        if (user && user.password === password) {
          // Store the user's email in session storage after a successful login
          sessionStorage.setItem('loggedInUserEmail', user.email);

          // Determine the user's role based on email domain
          var role = user.email.split('@')[1]; // Get the email domain (what comes after '@')

          // Define the pages for each role
          var rolePage = {
            'expert.com': 'expert.html',
            'farmer.com': 'farmers.html'
          };

          // Redirect to the appropriate page based on the user's role
          var targetPage = rolePage[role];
          if (targetPage) {
            window.location.href = targetPage;
          } else {
            displayError('Invalid role selected. Please select either "Farmer" or "Agricultural Expert".');
          }
        } else {
          displayError('Invalid username or password. Please try again.');
        }
      });

  function displayError(message) {
    errorMessage.textContent = message;
  }
});








