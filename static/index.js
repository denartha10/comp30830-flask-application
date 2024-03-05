// Event listener for when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', () => {
	// Mapping HTML IDs to elements
	const elements = {
		main: document.getElementById('mainContent'),
		menu: document.getElementById('sidebar'),
		menuToggle: document.getElementById('sidebarToggle'),
		weatherMenu: document.getElementById('weatherMenu'),
		weatherToggle: document.getElementById('weatherToggle'),
		closeWeather: document.getElementById('closeWeather'),
		searchBar: document.getElementById('searchBar'),
		searchTrip: document.getElementById('searchTrip'),
	};

	// Toggle sidebar visibility when the sidebar toggle button is clicked
	elements.menuToggle.addEventListener('click', () => {
		elements.menu.classList.toggle('-translate-x-96');
		elements.main.classList.toggle('translate-x-96');
	});

	// Clear the search bar when clicked
	elements.searchBar.addEventListener('click', () => {
		elements.searchBar.value = '';
	});

	// Toggle visibility of the weather menu when weather toggle button is clicked
	elements.weatherToggle?.addEventListener('click', () =>
		toggleElementVisibility(elements.weatherMenu)
	);

	// Hide the weather menu when the close button is clicked
	elements.closeWeather?.addEventListener('click', () =>
		elements.weatherMenu.classList.add('hidden')
	);

	// Call the displayClock function to display the current time
	displayClock();
});

// Function to toggle visibility of an element
const toggleElementVisibility = (element) => {
	element?.classList.toggle('hidden');
};

// Function to display the current time
const displayClock = () => {
	// Update the clock every second
	const updateClock = () => {
		const currentTime = new Date();
		const hours = currentTime.getHours();
		const minutes = currentTime.getMinutes();
		const display = `${hours}:${minutes}`;
		document.getElementById('liveTimer').textContent = display;
		setTimeout(updateClock, 1000);
	};
	// Initial call to update the clock
	updateClock();
};

// Function to clear inputs when the menu is closed
const clearInput = () => {
	['searchBar', 'startingDestination', 'endDestination'].forEach((id) => {
		const element = document.getElementById(id);
		// If element exists and menu is hidden, sets value of the element to an empty string
		if (
			element &&
			document.getElementById('menu').classList.contains('hidden')
		) {
			element.value = '';
		}
	});
};

//when search bar clicked
function searchBarClick() {
	//i want it to open the station list but idk if that exists yet
}

//this is what typing into the search bar actually calls
function showSearchPrompt() {
	const searchBar = document.getElementById('searchBar');
	const searchText = searchBar.value.trim().toLowerCase();
	for (id in sationDict) {
		let station = sationDict[id];
		let stationName = station['info']['name'];
		let stationNameLower = stationName.toLowerCase();
		if (
			searchText.localeCompare(stationNameLower.slice(0, searchText.length)) ==
			0
		) {
			// add in the html changes here
			console.log(stationName);
		}
	}
}

// Initialization function
function init() {
	pullData();
}

// Function to fetch bike data from the server
const pullData = async () => {
	try {
		const response = await fetch('/data');
		if (!response.ok) {
			throw new Error('Error');
		}
		const data = await response.json();
		initMap(JSON.parse(data.bike));
		populateWeather(JSON.parse(data.weather));
	} catch (error) {
		console.error(error);
		alert(error);
	}
};

// Declaration of variables related to the map
let map;
let sationDict = {};

// Function to initialize the map with the received data
const initMap = async (data) => {
	// Import necessary libraries
	const {Map} = await google.maps.importLibrary('maps');
	const {AdvancedMarkerElement, PinElement} = await google.maps.importLibrary(
		'marker'
	);

	// Initialize the map
	map = new Map(document.getElementById('map'), {
		zoom: 14,
		center: {lat: 53.347, lng: -6.27},
		mapTypeControl: false,
		streetViewControl: false,
		ClickableIcons: false,
		mapId: 'dublin_bike_map_id',
	});

	// Iterate through data and populate the markers
	for (let dat in data) {
		let d = data[dat];
		let background;
		let border;

		// Determine pin color based on bikes available and status
		if (d.status != 'OPEN') {
			background = '#00000000';
			border = '#00000000';
			//more than 5 bikes = green
		} else if (d.available_bikes > 5) {
			background = '#2ED18A';
			border = '#137333';
			//5-3 bikes = yellow
		} else if (d.available_bikes > 2) {
			background = '#FFFF00';
			border = '#B3B300';
			//1-2 bikes = orange
		} else if (d.available_bikes > 0) {
			background = '#FF9900';
			border = '#995C00';
			//no bikes = red
		} else {
			background = '#D22D2F';
			border = '#6E1718';
		}

		info_string = `
      <div class="max-w-xs">
        <div class="bg-white p-4 rounded-lg shadow-lg">
            <h2 class="text-lg font-semibold mb-2">${d.name}</h2>
            <div class="flex flex-col space-y-1">
                <div><span class="font-semibold">Bikes Available:</span> <span class="${
									d.available_bikes === 0 ? 'text-red-600' : 'text-gray-600'
								}">${d.available_bikes}</span></div>
                <div><span class="font-semibold">Stands Available:</span> <span class="text-gray-600">${
									d.available_stands
								}</span></div>
            </div>
        </div>
      </div>`;

		// Create pin style
		let pinStyle = new PinElement({
			background: background,
			borderColor: border,
			glyphColor: border,
		});

		const infowindow = new google.maps.InfoWindow({
			content: info_string,
			ariaLabel: `Bikes ${d.id.toString()}`,
		});

		// Create marker
		let newMarker = new AdvancedMarkerElement({
			map: map,
			position: {lat: d.lat, lng: d.lng},
			title: d.id.toString(),
			content: pinStyle.element,
			gmpClickable: true,
		});

		//Add event listener not available for the AdvancedMarkerElement in the version of the API we are using
		//We can use Marker element instead of AdvancedMarkerElement since that is the version of the API we are using
		newMarker.addEventListener('mouseover', () => {
			infowindow.open({
				anchor: newMarker,
				map,
			});
		});

		newMarker.addEventListener('mouseout', () => {
			infowindow.close();
		});

		newMarker.addEventListener('gmp-click', () => {
			//change for actual station select function
			console.log(d);
		});

		// Add marker to the array
		sationDict[d.id] = {
			marker: newMarker,
			info: d,
		};
	}
};

// Function to populate weather data on the front end
const populateWeather = (data) => {
	//we dont know what the key will be bc its the last row number in db
	//so we have to use a for loop that only runs once
	for (let dat in data) {
		let d = data[dat];
		document.getElementById('tempNum').innerText = d['temperature'];
		document.getElementById('precNum').innerText = d['precipitation'];
		document.getElementById('windNum').innerText = d['wind'];
	}
};
