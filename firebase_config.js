// Strangers United FC - Firebase Cloud Configuration
// When you create your free project at console.firebase.google.com,
// paste the config values below:

const FIREBASE_CONFIG = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
};

// Returns true if valid Firebase credentials are provided
const isFirebaseConfigured = Boolean(
    FIREBASE_CONFIG &&
    FIREBASE_CONFIG.apiKey &&
    FIREBASE_CONFIG.apiKey.length > 5 &&
    FIREBASE_CONFIG.projectId &&
    FIREBASE_CONFIG.projectId.length > 2
);
