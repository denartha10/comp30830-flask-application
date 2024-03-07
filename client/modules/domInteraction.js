// domInteraction.js
export const mainElement = document.getElementById("mainContent");
export const menuElement = document.getElementById("sidebar");
export const clockElement = document.getElementById("liveTimer");
export const weatherMenuElement = document.getElementById("weatherMenu");
export const searchBarElement = document.getElementById("searchBar");
export const menuToggleElement = document.getElementById("sidebarToggle");
export const weatherToggleElement = document.getElementById("weatherToggle");
export const closeWeatherElement = document.getElementById("closeWeather");
export const searchTripElement = document.getElementById("searchTrip");
export const mapElement = document.getElementById("map");

// Code for initializing DOM elements
const initializeDOM = () => {
    setTimeout(writeCurrentTimeToClock, 1000);
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

// Code for toggling weather menu visibility
const toggleWeatherMenuVisibility = () => {
    weatherMenuElement.classList.toggle("hidden");
};

const writeCurrentTimeToClock = () => {
    const currentTime = new Date();
    clockElement.textContent = `${currentTime.getHours()}:${currentTime.getMinutes()}`;
};

export { initializeDOM, toggleSidebarVisibility, clearSearchBar, toggleWeatherMenuVisibility, writeCurrentTimeToClock };
