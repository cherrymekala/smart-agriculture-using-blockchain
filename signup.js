document.addEventListener('DOMContentLoaded', function () {
  var signupForm = document.getElementById('signup-form');
  var errorMessage = document.getElementById('error-message');

  signupForm.addEventListener('submit', function (event) {
    event.preventDefault();

    var fullName = document.getElementById('fullname').value;
    var place = document.getElementById('place').value;
    var email = document.getElementById('email').value;
    var phone = document.getElementById('phone').value;
    var password = document.getElementById('password').value;
    var role = document.getElementById('role').value;

    
    // Create user object
    var user = {
      fullName: fullName,
      place: place,
      email: email,
      phone: phone,
      password: password,
      role: role
    };

    // Get existing registered users from localStorage
    var registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];

    // Check if the user already exists with the same email
    var existingUser = registeredUsers.find(function (u) {
      return u.email === email;
    });

    // Check if the email domain matches the role
    var validEmail = (role === 'farmer' && email.endsWith('@farmer.com')) ||
                     (role === 'agricultural_expert' && email.endsWith('@expert.com'));

    if (existingUser) {
      displayError('User already registered with this email. Please use a different email.');
    } else if (role === 'farmer' || role === 'agricultural_expert') {
      if (!validEmail) {
        displayError('Invalid email domain for the selected role. Farmers must use "@farmer.com" domain, and experts must use "@expert.com" domain.');
      } else {
        // Add the user to the list of registered users
        registeredUsers.push(user);
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

        // Redirect to login page after successful signup
        window.location.href = 'login.html';
      }
    } else {
      displayError('Invalid role selected. Please select either "Farmer" or "Agricultural Expert".');
    }
  });

  function displayError(message) {
    errorMessage.textContent = message;
  }
});





