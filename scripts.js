document.addEventListener('DOMContentLoaded', function () {

  var profileItem = document.getElementById('profile-item');
  var dashboardItem = document.getElementById('dashboard-item');
  var queryItem = document.getElementById('query-item');

  profileItem.addEventListener('click', showProfile);
  dashboardItem.addEventListener('click', showDashboard);
  queryItem.addEventListener('click', showQuery);

function showProfile() {
    var profileSection = document.getElementById('my-profile');
    var dashboardSection = document.getElementById('dashboard');
    var querySection = document.getElementById('query');

    profileSection.classList.remove('hidden');
    dashboardSection.classList.add('hidden');
    querySection.classList.add('hidden');

    // Update the image for the profile section
    var profileImage = document.getElementById('profile-image');
    profileImage.src = 'f.jpg'; // Replace 'profile.jpg' with the new image URL

      // Fetch and display user's profile details from local storage
  var loggedInUserEmail = sessionStorage.getItem('loggedInUserEmail');
  var userDetails = JSON.parse(localStorage.getItem('registeredUsers'));

  // Find the user details for the logged-in user based on their email
  var loggedInUser = userDetails.find(function (user) {
    return user.email === loggedInUserEmail;
  });

  if (loggedInUser) {
    // Update the profile details with the fetched user details
    var profileDetailsElement = document.getElementById('profile-details');
    profileDetailsElement.innerHTML = `
      <div class="profile-details-container">
          <p class="profile-detail"><strong>Name:</strong> ${loggedInUser.fullName}</p>
          <p class="profile-detail"><strong>Place:</strong> ${loggedInUser.place}</p>
          <p class="profile-detail"><strong>Email:</strong> ${loggedInUser.email}</p>
          <p class="profile-detail"><strong>Phone:</strong> ${loggedInUser.phone}</p>
          <!-- Add more details as needed -->
      </div>
    `;
  } else {
    // If the user details are not found, display an error message or handle it accordingly
    var profileDetailsElement = document.getElementById('profile-details');
    profileDetailsElement.innerHTML = `<div class="profile-details-container"><p>Error: User details not found.</p></div>`;
  }
}




 
});














