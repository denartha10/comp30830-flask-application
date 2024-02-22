document.addEventListener('DOMContentLoaded', () => {
    //Maps HTML IDs to elements
    const elements = {
        menu: document.getElementById('menu'),
        menuToggle: document.getElementById('menuToggle'),
        weatherMenu: document.getElementById('weatherMenu'),
        weatherToggle: document.getElementById('weatherToggle'),
        closeWeather: document.getElementById('closeWeather'),
        searchBar: document.getElementById('searchBar'),
        searchTrip: document.getElementById('searchTrip'),
    };

    //Toggles visibility of the main menu 
    //When closed, will close weather menu 
    elements.menuToggle?.addEventListener('click', () => {
        toggleElementVisibility(elements.menu);
        hideElement(elements.weatherMenu);
        clearInput(); //Call clearInput function to clear specific input values
    });

    elements.searchTrip?.addEventListener('click', () => {
        toggleElementVisibility(elements.weatherMenu); //Toggles visibility of the weather menu
        hideElement(elements.menu); //Hides the main menu when searching for a trip
        performSearch();  //Calls performSearch() placeholder
    });

    //Clears search bar when clicked, sets value to an empty string when clicked
    elements.searchBar.addEventListener('click', () => elements.searchBar.value = '');

    //toggles visibility of the weather menu 
    elements.weatherToggle?.addEventListener('click', () => toggleElementVisibility(elements.weatherMenu));

    //Hides the weather menu when close button clicked
    elements.closeWeather?.addEventListener('click', () => elements.weatherMenu.classList.add('hidden'));

    //Calls displayClock() to display the current time
    displayClock();
});

//Function to toggle visibility of an element
function toggleElementVisibility(element) {
    element?.classList.toggle('hidden'); //Toggles the class 'hidden' on the element if it exists
}

//Function to hide an element
function hideElement(element) {
    element?.classList.add('hidden'); //Adds the class 'hidden' to the element if it exists
}

//Clears inputs when the menu is closed
function clearInput() {
    ['searchBar', 'startingDestination', 'endDestination'].forEach(id => {
        const element = document.getElementById(id); //Gets the element by its ID
        if (element && document.getElementById('menu').classList.contains('hidden')) { 
            element.value = '';  //If element exists and menu is hidden, sets value of the element to an empty string
        }
    });
}

//function displays the current time
function displayClock(){
    var currentTime = new Date();
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();
    var display = hours + ":" + minutes;
    document.getElementById('liveTimer').textContent = display; 
    setTimeout(displayClock, 1000); 
}

//placeholder for the actual search functionality - TBC
function performSearch() {
    const searchBar = document.getElementById('searchBar');
    const searchText = searchBar.value.trim();
}


function initMap() {
	var map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 53.347, lng: -6.27},
		zoom: 14,
		mapTypeControl: false,
    streetViewControl: false
	});
	setMarkers(map);
}

function setMarkers(map) {
	fetch('markers.json')
		.then((response) => {
			if (!response.ok) {
				throw new Error('Error');
			}
			return response.json(); //parse JSON data
		})
		.then((data) => drawMarkers(data, map)) //if everything is good send JSON objects to func
		.catch((error) => {
			console.error(error); //send the error to the console
			alert(error);
		});
}

function drawMarkers(data, map) {
	for (let d of data) {
		var marker = new google.maps.Marker({
			map: map,
			position: {lat: d.lat, lng: d.lng},
			label: d.id.toString(),
		});
    google.maps.event.addDomListener(marker, 'click', function() {console.log(d.id)});
	}
}
