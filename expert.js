// This function will show the profile section.
function showProfile() {
  document.getElementById("my-profile").classList.remove("hidden");
  document.getElementById("farmers").classList.add("hidden");
  document.getElementById("query").classList.add("hidden");
}

// This function will show the farmers section.
function showFarmers() {
  document.getElementById("my-profile").classList.add("hidden");
  document.getElementById("farmers").classList.remove("hidden");
  document.getElementById("query").classList.add("hidden");
}

// This function will show the query section.
function showQuery() {
  document.getElementById("my-profile").classList.add("hidden");
  document.getElementById("farmers").classList.add("hidden");
  document.getElementById("query").classList.remove("hidden");
}

// This function will load the farmers list.
function loadFarmersList() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "/api/farmers");
  xhr.onload = function () {
    if (xhr.status === 200) {
      var farmers = JSON.parse(xhr.responseText);
      var farmersList = document.getElementById("farmers-list");
      farmersList.innerHTML = "";
      for (var i = 0; i < farmers.length; i++) {
        var farmer = farmers[i];
        var li = document.createElement("li");
        var img = document.createElement("img");
        img.src = farmer.image;
        var span = document.createElement("span");
        span.innerHTML = farmer.name;
        li.appendChild(img);
        li.appendChild(span);
        farmersList.appendChild(li);
      }
    }
  };
  xhr.send();
}

// This function will initialize the page.
function init() {
  loadFarmersList();
}

window.onload = init;
