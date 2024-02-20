document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const menu = document.getElementById("menu");
  const weatherToggle = document.getElementById("weatherToggle");
  const weatherMenu = document.getElementById("weatherMenu");
  const searchBar = document.getElementById('searchBar');
  const searchTripButton = document.getElementById('searchTrip');
  const closeWeatherMenuButton = document.getElementById('closeWeatherMenu');

  searchBar.addEventListener('click', function() {
    this.value = ''; 
  });

  if (closeWeatherMenuButton) {
    closeWeatherMenuButton.addEventListener("click", () => {
        weatherMenu.classList.add('hidden');
    });
  }

  if (searchTripButton) {
    searchTripButton.addEventListener("click", () => {
        toggleElementVisibility(weatherMenu);
        hideElement(document.getElementById('menu'));
    });
  }

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      toggleElementVisibility(menu);
      hideElement(weatherMenu);

  if (menu.classList.contains('hidden')) {
      searchBar.value = '';
        startingDestination.value = '';
        endDestination.value = '';
      }
  });
  }
  if (weatherToggle) {
    weatherToggle.addEventListener("click", () => {
      toggleElementVisibility(weatherMenu);
    });
  }
  updateLiveTimer();
  setInterval(updateLiveTimer, 60000);
});

function toggleElementVisibility(element) {
  element.classList.toggle('hidden');
}

function hideElement(element) {
  element.classList.add('hidden');
}

function updateLiveTimer() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const timeString = `${hours}:${minutes}`;
  document.getElementById('liveTimer').textContent = timeString;
}

setInterval(updateLiveTimer, 6000);

function performSearch() {
  const searchBar = document.getElementById('searchBar');
  const searchPrompt = document.getElementById('searchPrompt');
  const searchText = searchBar.value.trim();

  if (searchText.length > 0) {
    searchPrompt.textContent = `Searching for "${searchText}"...`;
    searchPrompt.classList.remove('hidden');
  } else {
    searchPrompt.classList.add('hidden');
  }
}

function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 53.35, lng: -6.26},
      zoom: 13,
      mapTypeControl: false
  });

  var input = document.getElementById('searchBar');
  var autocomplete = new google.maps.places.Autocomplete(input);

  autocomplete.setFields(['address_components', 'geometry', 'icon', 'name']);

  var marker = new google.maps.Marker({
      map: map,
      anchorPoint: new google.maps.Point(0, -29)
  });

  autocomplete.addListener('place_changed', function() {
      marker.setVisible(false);
      var place = autocomplete.getPlace();
      if (!place.geometry) {
          window.alert("No Information available for: '" + place.name + "'");
          return;
      }

      if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport);
      } else {
          map.setCenter(place.geometry.location);
          map.setZoom(17);
      }
      marker.setPosition(place.geometry.location);
      marker.setVisible(true);
  });

  var startAutocomplete = new google.maps.places.Autocomplete(
    document.getElementById('startingDestination'),
    {types: ['geocode']}
  );

  var endAutocomplete = new google.maps.places.Autocomplete(
    document.getElementById('endDestination'),
    {types: ['geocode']}
  );

  google.maps.event.addListener(startAutocomplete, 'place_changed', function() {
    var place = startAutocomplete.getPlace();
    console.log("Start place selected: ", place.formatted_address);
  });

  google.maps.event.addListener(endAutocomplete, 'place_changed', function() {
    var place = endAutocomplete.getPlace();
    console.log("End place selected: ", place.formatted_address);
  });
}
