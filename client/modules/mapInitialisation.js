// mapInteraction.js
import { fetchData } from "./dataFetching";
import { mapElement } from "./domInteraction";
import { Loader } from "@googlemaps/js-api-loader";

// Initialize the Google Maps API
const initializeGoogleMaps = async () => {
    const loader = new Loader({
        apiKey: "YOUR_API_KEY",
        version: "weekly"
    });

    await loader.load();
};

// Import relevant functions
const importGoogleMapsLibraries = async () => {
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");

    return { Map, AdvancedMarkerElement, PinElement };
};

await initializeGoogleMaps();
const { Map, AdvancedMarkerElement, PinElement } = await importGoogleMapsLibraries();

// Determine pin colors based on station status and available bikes
const determinePinColors = station => {
    if (station.status != "OPEN") {
        return { background: "rgba(077, 077, 077)", border: "rgba(041, 041, 041)" };
    } else if (station.available_bikes > 5) {
        return { background: "rgba(046, 209, 138)", border: "rgba(019, 115, 051)" };
    } else if (station.available_bikes > 2) {
        return { background: "rgba(255, 255, 000)", border: "rgba(179, 179, 000)" };
    } else if (station.available_bikes > 0) {
        return { background: "rgba(255, 153, 000)", border: "rgba(153, 092, 000)" };
    } else {
        return { background: "rgba(217, 098, 099)", border: "rgba(110, 023, 024)" };
    }
};

// Create pin element based on colors, station, and an element
const createPin = (station, { background, border }) => {
    const div = document.createElement("div");
    div.className = "font-bold";
    div.style.fontSize = "14px";
    div.textContent = station.available_bikes.toString();

    return new PinElement({
        background: background,
        borderColor: border,
        glyphColor: border,
        glyph: div
    });
};

// Create the info window content from station information
const createInfoWindowContent = station => {
    return `
        <div class="max-w-xs">
            <div class="bg-white p-2 rounded-lg shadow-lg">
                <h2 class="text-lg font-semibold mb-2">${station.name}</h2>
                <div class="flex flex-col space-y-1">
                    <div><span class="font-semibold">Bikes Available:</span> <span class="${station.available_bikes === 0 ? "text-red-600" : "text-gray-600"}">${station.available_bikes}</span></div>
                    <div><span class="font-semibold">Stands Available:</span> <span class="text-gray-600">${station.available_stands}</span></div>
                </div>
            </div>
        </div>`;
};

// Create an info window from station information
const createInfoWindow = (station, content) => {
    return new google.maps.InfoWindow({
        content: content,
        ariaLabel: `Bike Stand ${station.id.toString()}`
    });
};

// Create an advanced marker from pin, station, and map object
const createAdvancedMarker = (map, pin, station) => {
    return new AdvancedMarkerElement({
        map: map,
        position: { lat: station.lat, lng: station.lng },
        title: "not selected",
        content: pin.element,
        gmpClickable: true
    });
};

const mapSettings = {
    zoom: 14,
    center: { lat: 53.347, lng: -6.27 },
    mapTypeControl: false,
    streetViewControl: false,
    ClickableIcons: false,
    mapId: "dublin_bike_map_id"
};

const map = new Map(mapElement, mapSettings);

const stations = await fetchData();

const station_PinColors = stations.map(station => [station, determinePinColors(station)]);
const station_Pins = station_PinColors.map(([station, { background, border }]) => [station, createPin(station, { background, border })]);
const stations_Pins_InfoWindow = station_Pins.map(([station, pin]) => [station, pin, createInfoWindowContent(station)]);

const station_Markers_InfoWindow = stations_Pins_InfoWindow.map(([station, pin, infoWindowContent]) => [station, pin, createAdvancedMarker(map, pin, station), createInfoWindow(station, infoWindowContent)]);

const stationDict = station_Markers_InfoWindow.reduce((dict, [station, pin, marker, _]) => {
    dict[station.id] = { marker, info: station, pin };
    return dict;
}, {});
