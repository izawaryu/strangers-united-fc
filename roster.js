// Strangers United FC - Season Registration & Roster Data

const SEASON_CONFIG = {
    seasonName: "CSX Fall Men 40+ IV 2026",
    teamFee: 1099,
    refFeePerGame: 30,
    estGames: 11,
    minPlayers: 10,
    targetDues: 140, // ~$140 per player (covers $1099 + ref fees)
    venmoHandle: "Ryu-Izawa",
    venmoUrl: "https://venmo.com/u/Ryu-Izawa",
    captainPin: "1234"
};

// Initial roster seeded with current club members
// Players marked as paid are active on the attendance page; unpaid players must be verified by captain
const DEFAULT_MEMBERS = [
    { id: 1, name: "Ryu", whatsapp: "+1 (Captain)", position: "Midfield", paid: true, note: "Captain", date: "Oct 1, 2026" },
    { id: 2, name: "Ali", whatsapp: "+1 555-0101", position: "Forward", paid: true, note: "Paid Venmo", date: "Oct 1, 2026" },
    { id: 3, name: "Tim", whatsapp: "+1 555-0102", position: "Defense", paid: true, note: "Paid Venmo", date: "Oct 2, 2026" },
    { id: 4, name: "Adam", whatsapp: "+1 555-0103", position: "Midfield", paid: true, note: "Paid Venmo", date: "Oct 2, 2026" },
    { id: 5, name: "Alberth", whatsapp: "+1 555-0104", position: "Forward", paid: true, note: "Paid Venmo", date: "Oct 3, 2026" },
    { id: 6, name: "Andrew", whatsapp: "+1 555-0105", position: "Defense", paid: true, note: "Paid Venmo", date: "Oct 3, 2026" },
    { id: 7, name: "Darren", whatsapp: "+1 555-0106", position: "Midfield", paid: true, note: "Paid Venmo", date: "Oct 4, 2026" },
    { id: 8, name: "David", whatsapp: "+1 555-0107", position: "Goalkeeper", paid: true, note: "Paid Venmo", date: "Oct 4, 2026" },
    { id: 9, name: "Edinson", whatsapp: "+1 555-0108", position: "Forward", paid: true, note: "Paid Venmo", date: "Oct 4, 2026" },
    { id: 10, name: "Fawman", whatsapp: "+1 555-0109", position: "Defense", paid: true, note: "Paid Venmo", date: "Oct 5, 2026" },
    { id: 11, name: "Harry", whatsapp: "+1 555-0110", position: "Midfield", paid: false, note: "Pending dues", date: "Oct 8, 2026" },
    { id: 12, name: "Hernan", whatsapp: "+1 555-0111", position: "Defense", paid: false, note: "Pending dues", date: "Oct 8, 2026" },
    { id: 13, name: "Jorge", whatsapp: "+1 555-0112", position: "Forward", paid: false, note: "Pending dues", date: "Oct 9, 2026" },
    { id: 14, name: "Kurt", whatsapp: "+1 555-0113", position: "Midfield", paid: false, note: "Pending dues", date: "Oct 9, 2026" },
    { id: 15, name: "Luis", whatsapp: "+1 555-0114", position: "Defense", paid: false, note: "Pending dues", date: "Oct 10, 2026" },
    { id: 16, name: "Matt", whatsapp: "+1 555-0115", position: "Midfield", paid: false, note: "Pending dues", date: "Oct 10, 2026" }
];

function getStoredRegistrations() {
    const raw = localStorage.getItem('strangers_fc_registrations');
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
    localStorage.setItem('strangers_fc_registrations', JSON.stringify(data));
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
