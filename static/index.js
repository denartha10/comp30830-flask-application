document.addEventListener("DOMContentLoaded", () => {
  //Maps HTML IDs to elements
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

  // //Toggles visibility of the main menu
  // //When closed, will close weather menu
  // elements.menuToggle?.addEventListener('click', () => {
  // 	toggleElementVisibility(elements.menu);
  // 	hideElement(elements.weatherMenu);
  // 	clearInput(); //Call clearInput function to clear specific input values
  // });
  //
  // elements.searchTrip?.addEventListener('click', () => {
  // 	toggleElementVisibility(elements.weatherMenu); //Toggles visibility of the weather menu
  // 	hideElement(elements.menu); //Hides the main menu when searching for a trip
  // 	performSearch(); //Calls performSearch() placeholder
  // });

  //Adds toggle for new sidebar
  sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("-translate-x-full");
    mainContent.classList.toggle("translate-x-96");
  });

  //Clears search bar when clicked, sets value to an empty string when clicked
  elements.searchBar.addEventListener(
    "click",
    () => (elements.searchBar.value = ""),
  );

  //toggles visibility of the weather menu
  elements.weatherToggle?.addEventListener("click", () =>
    toggleElementVisibility(elements.weatherMenu),
  );

  //Hides the weather menu when close button clicked
  elements.closeWeather?.addEventListener("click", () =>
    elements.weatherMenu.classList.add("hidden"),
  );

  //Calls displayClock() to display the current time
  displayClock();
});

//Function to toggle visibility of an element
function toggleElementVisibility(element) {
  element?.classList.toggle("hidden"); //Toggles the class 'hidden' on the element if it exists
}

//Function to hide an element
function hideElement(element) {
  element?.classList.add("hidden"); //Adds the class 'hidden' to the element if it exists
}

//Clears inputs when the menu is closed
function clearInput() {
  ["searchBar", "startingDestination", "endDestination"].forEach((id) => {
    const element = document.getElementById(id); //Gets the element by its ID
    if (
      element &&
      document.getElementById("menu").classList.contains("hidden")
    ) {
      element.value = ""; //If element exists and menu is hidden, sets value of the element to an empty string
    }
  });
}

//function displays the current time
function displayClock() {
  var currentTime = new Date();
  var hours = currentTime.getHours();
  var minutes = currentTime.getMinutes();
  var display = hours + ":" + minutes;
  document.getElementById("liveTimer").textContent = display;
  setTimeout(displayClock, 1000);
}

//placeholder for the actual search functionality - TBC
function performSearch() {
  const searchBar = document.getElementById("searchBar");
  const searchText = searchBar.value.trim();
}

//map and weather initialization called by map api key in index.html
function init() {
  pullBikeData();
  pullWeatherData();
}

function pullBikeData() {
  fetch("markers.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error");
      }
      return response.json(); //parse JSON data
    })
    .then((data) => initMap(data)) //if everything is good send JSON objects to func
    .catch((error) => {
      console.error(error); //send the error to the console
      alert(error);
    });
}

// Initialize and add the map
let map;
let markersArr = [];

async function initMap(data) {
  // Request needed libraries.
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  const { PinElement } = await google.maps.importLibrary("marker");

  //Init the map
  map = new Map(document.getElementById("map"), {
    zoom: 14,
    center: { lat: 53.347, lng: -6.27 },
    mapTypeControl: false,
    streetViewControl: false,
    ClickableIcons: false,
    //idk what the mapID is but wont load without one
    mapId: "dublin_bike_map_id",
  });
  //iterate through data and populate the markers
  for (let dat in data) {
    let d = data[dat];
    let background;
    let border;
    // Change the pin color depending on the bikes available and status.
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
    let pinStyle = new PinElement({
      background: background,
      borderColor: border,
      glyphColor: border,
    });
    let newMarker = new AdvancedMarkerElement({
      map: map,
      position: { lat: d.lat, lng: d.lng },
      title: d.id.toString(),
      content: pinStyle.element,
    });
    markersArr.push(newMarker);
    newMarker.addListener("click", function () {
      iconClick(d);
    });
  }
}

//can change what the icon click function does later
function iconClick(stationInfo) {
  console.log(stationInfo);
}

function pullWeatherData() {
  fetch("weather.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error");
      }
      return response.json(); //parse JSON data
    })
    .then((data) => populateWeather(data)) //if everything is good send JSON objects to func
    .catch((error) => {
      console.error(error); //send the error to the console
      alert(error);
    });
}

//create weather JS object you can reference in front end
function populateWeather(data) {
  document.getElementById("tempNum").innerText = data["temp"];
  document.getElementById("precNum").innerText = data["prec"];
  document.getElementById("windNum").innerText = data["wind"];
}
