/**
 * Suraksha360 - Real-Time GPS Tracking Module
 * Interfaces with W3C Geolocation API (navigator.geolocation.watchPosition)
 */

let watchId = null;

function initGpsTracking() {
    const statusEl = document.getElementById('status');
    const latEl = document.getElementById('latitude');
    const lonEl = document.getElementById('longitude');
    const speedEl = document.getElementById('speed');
    const headingEl = document.getElementById('heading');
    const altEl = document.getElementById('altitude');
    const mapLinkEl = document.getElementById('mapLink');

    if (!("geolocation" in navigator)) {
        if (statusEl) {
            statusEl.textContent = 'Status: Geolocation not supported by browser';
            statusEl.className = 'gps-status error';
        }
        return;
    }

    if (statusEl) {
        statusEl.textContent = 'Status: Initializing satellite fix...';
        statusEl.className = 'gps-status idle';
    }

    watchId = navigator.geolocation.watchPosition(
        function (position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const speed = position.coords.speed !== null ? (position.coords.speed * 3.6).toFixed(2) + ' km/h' : '0.00 km/h';
            const heading = position.coords.heading !== null ? position.coords.heading + '°' : 'N/A';
            const alt = position.coords.altitude !== null ? position.coords.altitude.toFixed(1) + ' m' : 'N/A';

            if (statusEl) {
                statusEl.textContent = 'Status: Live Satellite Tracking Active';
                statusEl.className = 'gps-status active';
            }
            if (latEl) latEl.textContent = lat.toFixed(6);
            if (lonEl) lonEl.textContent = lon.toFixed(6);
            if (speedEl) speedEl.textContent = speed;
            if (headingEl) headingEl.textContent = heading;
            if (altEl) altEl.textContent = alt;

            if (mapLinkEl) {
                mapLinkEl.href = `https://www.google.com/maps?q=${lat},${lon}`;
                mapLinkEl.style.display = 'inline-block';
            }
        },
        function (error) {
            let errorMsg = 'Error retrieving location';
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    errorMsg = 'Location permission denied by user';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMsg = 'Location information unavailable';
                    break;
                case error.TIMEOUT:
                    errorMsg = 'Location request timed out';
                    break;
            }
            if (statusEl) {
                statusEl.textContent = 'Status: ' + errorMsg;
                statusEl.className = 'gps-status error';
            }
        },
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 15000
        }
    );
}

// Stop tracking on page unload
window.addEventListener('beforeunload', () => {
    if (watchId !== null && "geolocation" in navigator) {
        navigator.geolocation.clearWatch(watchId);
    }
});

// Auto-start if element is present
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('status')) {
        initGpsTracking();
    }
});
