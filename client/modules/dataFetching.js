// dataFetching.js

// Code for fetching data from the server
// It just gets and returns the data or throws an error
const fetchData = async () => {
    try {
        const response = await fetch("/data");
        if (!response.ok) {
            throw new Error("Failed to fetch bike data from server");
        }
        const data = await response.json();
    } catch (error) {
        console.error(error);
    }
};

const populateMap = data => {
    // Code for populating the map with data
};

const populateWeather = data => {
    // Code for populating weather data on the front endsWith;
    for (let dat in data) {
        let d = data[dat];
        document.getElementById("tempNum").innerText = d["temperature"];
        document.getElementById("precNum").innerText = d["precipitation"];
        document.getElementById("windNum").innerText = d["wind"];
    }
};

export { fetchData };
