// Event listener for when the DOM content is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Mapping HTML IDs to elements
  const elements = {
    main: document.getElementById("mainContent"),
    menu: document.getElementById("sidebar"),
    menuToggle: document.getElementById("sidebarToggle"),
    weatherMenu: document.getElementById("weatherMenu"),
    weatherToggle: document.getElementById("weatherToggle"),
    closeWeather: document.getElementById("closeWeather"),
    searchBar: document.getElementById("searchBar"),
    searchTrip: document.getElementById("searchTrip"),
  };

  // Toggle sidebar visibility when the sidebar toggle button is clicked
  elements.menuToggle.addEventListener("click", () => {
    elements.menu.classList.toggle("-translate-x-96");
    elements.main.classList.toggle("translate-x-96");
  });

  // Clear the search bar when clicked
  elements.searchBar.addEventListener("click", () => {
    elements.searchBar.value = "";
  });

  // Toggle visibility of the weather menu when weather toggle button is clicked
  elements.weatherToggle?.addEventListener("click", () =>
    toggleElementVisibility(elements.weatherMenu),
  );

  // Hide the weather menu when the close button is clicked
  elements.closeWeather?.addEventListener("click", () =>
    elements.weatherMenu.classList.add("hidden"),
  );

  // Call the displayClock function to display the current time
  displayClock();
});

// Function to toggle visibility of an element
const toggleElementVisibility = (element) => {
  element?.classList.toggle("hidden");
};

// Function to display the current time
const displayClock = () => {
  // Update the clock every second
  const updateClock = () => {
    const currentTime = new Date();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const display = `${hours}:${minutes}`;
    document.getElementById("liveTimer").textContent = display;
    setTimeout(updateClock, 1000);
  };
  // Initial call to update the clock
  updateClock();
};

// Function to clear inputs when the menu is closed
const clearInput = () => {
  ["searchBar", "startingDestination", "endDestination"].forEach((id) => {
    const element = document.getElementById(id);
    // If element exists and menu is hidden, sets value of the element to an empty string
    if (
      element &&
      document.getElementById("menu").classList.contains("hidden")
    ) {
      element.value = "";
    }
  });
};

// Placeholder for the actual search functionality - To be completed
const performSearch = () => {
  const searchBar = document.getElementById("searchBar");
  const searchText = searchBar.value.trim();
};

// Initialization function
function init() {
  pullBikeData();
  pullWeatherData();
}

// Function to fetch bike data from the server
const pullBikeData = async () => {
  try {
    const response = await fetch("markers.json");
    if (!response.ok) {
      throw new Error("Error");
    }
    const data = await response.json();
    initMap(data);
  } catch (error) {
    console.error(error);
    alert(error);
  }
};

// Declaration of variables related to the map
let map;
let markersArr = [];

// Function to initialize the map with the received data
const initMap = async (data) => {
  // Import necessary libraries
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement, PinElement } =
    await google.maps.importLibrary("marker");

  // Initialize the map
  map = new Map(document.getElementById("map"), {
    zoom: 14,
    center: { lat: 53.347, lng: -6.27 },
    mapTypeControl: false,
    streetViewControl: false,
    ClickableIcons: false,
    mapId: "dublin_bike_map_id",
  });

  // Iterate through data and populate the markers
  for (let dat in data) {
    let d = data[dat];
    let background;
    let border;

    // Determine pin color based on bikes available and status
    if (d.status != "OPEN") {
      background = "#00000000";
      border = "#00000000";
    } else if (d.bikes_open > 3) {
      background = "#2ED18A";
      border = "#137333";
    } else if (d.bikes_open > 0) {
      background = "#E8C54E";
      border = "#B18E17";
    } else {
      background = "#D22D2F";
      border = "#6E1718";
    }

    // Create pin style
    let pinStyle = new PinElement({
      background: background,
      borderColor: border,
      glyphColor: border,
    });

    const infowindow = new google.maps.InfoWindow({
      content: JSON.stringify(d),
      ariaLabel: `Bikes ${d.id.toString()}`,
    });

    // Create marker
    let newMarker = new AdvancedMarkerElement({
      map: map,
      position: { lat: d.lat, lng: d.lng },
      title: d.id.toString(),
      content: pinStyle.element,
    });

    newMarker.addListener("click", () => {
      infowindow.open({
        anchor: newMarker,
        map,
      });
    });

    // Add marker to the array
    markersArr.push(newMarker);

    // Add click event listener to the marker
    // newMarker.addListener("click", () => {
    //   iconClick(d);
    // });
  }
};

// Function called when a marker icon is clicked
const iconClick = (stationInfo) => {
  console.log(stationInfo);
};

// Function to fetch weather data from the server
const pullWeatherData = async () => {
  try {
    const response = await fetch("weather.json");
    if (!response.ok) {
      throw new Error("Error");
    }
    const data = await response.json();
    populateWeather(data);
  } catch (error) {
    console.error(error);
    alert(error);
  }
};

// Function to populate weather data on the front end
const populateWeather = (data) => {
  document.getElementById("tempNum").innerText = data["temp"];
  document.getElementById("precNum").innerText = data["prec"];
  document.getElementById("windNum").innerText = data["wind"];
};
