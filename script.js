//Leaflet.js
let map = L.map('map').setView([20, 80], 3);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

navigator.geolocation.getCurrentPosition(position => {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    L.marker([lat, lon]).addTo(map)
        .bindPopup("📍 Your Location").openPopup();
});

//Real-Time Earthquake Data (USGS API)
const USGS_API_URL = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&limit=5&minmagnitude=6";

async function fetchEarthquakes() {
    try {
        let response = await fetch(USGS_API_URL);
        let data = await response.json();
        let earthquakeContainer = document.getElementById('earthquake-alerts');
        earthquakeContainer.innerHTML = "";

        data.features.forEach(earthquake => {
            let coords = earthquake.geometry.coordinates;
            let lat = coords[1], lon = coords[0];
            let magnitude = earthquake.properties.mag;
            let place = earthquake.properties.place;
            
            L.circle([lat, lon], {
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.5,
                radius: magnitude * 50000 
            }).addTo(map).bindPopup(`🌍 Location: ${place} <br> 💥 Magnitude: ${magnitude}`);
            
            let alertDiv = document.createElement("div");
            alertDiv.classList.add("alert", "earthquake-alert");
            alertDiv.innerHTML = `🔴 ${place} - Magnitude: ${magnitude}`;
            earthquakeContainer.appendChild(alertDiv);
            
            sendNotification(`🌊 Tsunami Warning!`, `Earthquake of Magnitude ${magnitude} near ${place}`);
        });

    } catch (error) {
        console.error("Error fetching earthquake data:", error);
        document.getElementById('earthquake-alerts').innerHTML = "⚠️ Failed to load alerts.";
    }
}
fetchEarthquakes();

// Fetch Flood Alerts (Placeholder Example)
async function fetchFloodAlerts() {
    let floodContainer = document.getElementById('flood-alerts');
    floodContainer.innerHTML = "Flood warning data is being processed...";

    setTimeout(() => {
        let alertDiv = document.createElement("div");
        alertDiv.classList.add("alert", "flood-alert");
        alertDiv.innerHTML = "🚨 High Flood Risk in Coastal Areas!";
        floodContainer.appendChild(alertDiv);
    }, 2000);
}

//Evacuation Centers (Manually Added)
let evacuationCenters = [
    { name: "Safe Zone 1", lat: 15.2993, lon: 74.1240 },
    { name: "Safe Zone 2", lat: 12.9716, lon: 77.5946 }
];

evacuationCenters.forEach(center => {
    L.marker([center.lat, center.lon]).addTo(map)
      .bindPopup(`🏠 Evacuation Center: ${center.name}`);
});

function sendNotification(title, message) {
    if ("Notification" in window) {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification(title, { body: message });
            }
        });
    }
}
