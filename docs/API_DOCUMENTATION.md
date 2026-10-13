# Suraksha360 — Technical Specifications & Data Models

This document details the APIs, browser interfaces, and data models used across Suraksha360.

---

## 1. W3C Geolocation API Integration

The real-time tracking interface (`gps-tracking.html` and `js/gps.js`) interfaces with the standard W3C Geolocation specification.

### Implementation:
```javascript
navigator.geolocation.watchPosition(successCallback, errorCallback, options);
```

### Configuration Options:
| Option | Value | Rationale |
|---|---|---|
| `enableHighAccuracy` | `true` | Requests GPS satellite triangulation instead of low-precision IP/cell-tower geo. |
| `maximumAge` | `0` | Disables cached positions to ensure freshly acquired telemetry. |
| `timeout` | `15000` | Aborts request after 15 seconds if satellite lock cannot be established. |

### Telemetry Payload Schema:
```json
{
  "coords": {
    "latitude": 17.686816,
    "longitude": 83.218482,
    "accuracy": 5.0,
    "altitude": 14.2,
    "heading": 85.0,
    "speed": 0.0
  },
  "timestamp": 1744474320000
}
```

### Error Code Handling:
- **`error.PERMISSION_DENIED` (Code 1)**: User rejected browser permission prompt. Displays `"Location permission denied by user"`.
- **`error.POSITION_UNAVAILABLE` (Code 2)**: GPS hardware unavailable or underground/indoor satellite blockage.
- **`error.TIMEOUT` (Code 3)**: Satellite acquisition timed out.

---

## 2. Local Data Models & Schemas

### A. Emergency Contacts (`localStorage.getItem('suraksha360_contacts')`)
```json
[
  {
    "name": "Mom",
    "phone": "+91 9876543210"
  },
  {
    "name": "Bestie",
    "phone": "+91 9988776655"
  },
  {
    "name": "Police Station",
    "phone": "100"
  }
]
```

### B. Police Stations Dataset (`data/police_stations.json`)
```json
[
  {
    "name": "Women Police Station",
    "address": "75 Feet Rd, Purna Market, Allipuram, Suryabagh, Visakhapatnam - 530020",
    "phone": "7569632333",
    "displayPhone": "75696-32333",
    "mapsUrl": "https://www.google.com/maps?q=Purna+Market,+Visakhapatnam",
    "city": "Visakhapatnam"
  },
  {
    "name": "Disha Mahila Police Station",
    "address": "62, NH16, Near NH 5 Road, Varahagiri Nagar, Yendada, Visakhapatnam - 530045",
    "phone": "1091",
    "displayPhone": "1091",
    "mapsUrl": "https://www.google.com/maps?q=Yendada,+Visakhapatnam",
    "city": "Visakhapatnam"
  }
]
```

### C. Alert Preferences (`localStorage.getItem('suraksha360_*')`)
| Key | Type | Default | Description |
|---|---|---|---|
| `suraksha360_soundNotification` | boolean | `true` | Toggles audible sirens during alerts. |
| `suraksha360_smsNotification` | boolean | `true` | Toggles SMS dispatch to contacts. |
| `suraksha360_autoShareLocation` | boolean | `true` | Toggles live GPS coordinates broadcasting. |
