// Strangers United FC - Season Registration & Roster Data

const SEASON_CONFIG = {
    seasonName: "CSX Winter 2026/2027",
    teamFee: 1099,
    refFeePerGame: 30,
    estGames: 10,
    totalCost: 1399, // $1,099 league fee + 10 matches * $30 referee fee = $1,399
    minPlayers: 10,
    targetDues: 140, // $1,399 / 10 = $140 per player
    venmoHandle: "Ryu-Izawa",
    venmoUrl: "https://venmo.com/u/Ryu-Izawa",
    captainPin: "1234"
};

// Initial roster: only Ryu is pre-listed as paid via Venmo.
// All other players are added after registering.
const DEFAULT_MEMBERS = [
    {
        id: 1,
        name: "Ryu",
        whatsapp: "",
        position: "Midfield",
        paid: true,
        note: "Paid Venmo",
        date: "Oct 14, 2026"
    }
];

const REGISTRATIONS_STORAGE_KEY = 'strangers_fc_registrations_v2';

function getStoredRegistrations() {
    const raw = localStorage.getItem(REGISTRATIONS_STORAGE_KEY);
    if (raw) {
        try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) {
            console.warn("Could not parse registrations from localStorage", e);
        }
    }
    return DEFAULT_MEMBERS;
}

function saveStoredRegistrations(data) {
    localStorage.setItem(REGISTRATIONS_STORAGE_KEY, JSON.stringify(data));
}

function getActivePaidPlayers() {
    return getStoredRegistrations()
        .filter(p => p.paid === true)
        .map(p => p.name);
}

// Backward-compatibility wrapper for any script referencing ROSTER_PLAYERS
const ROSTER_PLAYERS = {
    forEach(callback) {
        getActivePaidPlayers().forEach(callback);
    },
    filter(callback) {
        return getActivePaidPlayers().filter(callback);
    },
    find(callback) {
        return getActivePaidPlayers().find(callback);
    },
    map(callback) {
        return getActivePaidPlayers().map(callback);
    },
    get length() {
        return getActivePaidPlayers().length;
    }
};

// Online JSON Persistence Blob API (Free shared endpoint)
const ATTENDANCE_API_URL = "https://api.jsonblob.com/api/jsonBlob/019fdf1e-c6e3-738b-8e97-ad39101192c3";
