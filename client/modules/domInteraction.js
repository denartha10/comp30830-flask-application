// domInteraction.js
export const mainElement = document.getElementById("mainContent");
export const menuElement = document.getElementById("sidebar");
export const clockElement = document.getElementById("liveTimer");
export const weatherMenuElement = document.getElementById("weatherMenu");
export const searchBarElement = document.getElementById("searchBar");
export const closeWeatherElement = document.getElementById("closeWeather");
export const searchTripElement = document.getElementById("searchTrip");
export const mapElement = document.getElementById("map");

//intercative
export const menuToggleElement = document.getElementById("sidebarToggle");
export const weatherToggleElement = document.getElementById("weatherToggle");

// Code for initializing DOM elements intercativity
// If you need to add event listeners define functions separetly and do that here
const initializeDOM = () => {
    setTimeout(writeCurrentTimeToClock, 1000);
    menuToggleElement.addEventListener("click", toggleSidebarVisibility);
};

// Code for toggling sidebar visibility
const toggleSidebarVisibility = () => {
    menuElement.classList.toggle("-translate-x-96");
    mainElement.classList.toggle("translate-x-96");
};

// Code for clearing the search bar
const clearSearchBar = () => {
    searchBarElement.value = "";
};

const writeCurrentTimeToClock = () => {
    const currentTime = new Date();
    clockElement.textContent = `${currentTime.getHours()}:${currentTime.getMinutes()}`;
};

export { initializeDOM, toggleSidebarVisibility, clearSearchBar, writeCurrentTimeToClock };
