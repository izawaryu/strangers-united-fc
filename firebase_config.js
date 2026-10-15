// Strangers United FC - Firebase Cloud Configuration
// Connected to project: strangers-fc-9fd65

const FIREBASE_CONFIG = {
    apiKey: "AIzaSyDP5mXtwTEvtdWSePDAqbS-Jdq4Vf9GM1M",
    authDomain: "strangers-fc-9fd65.firebaseapp.com",
    projectId: "strangers-fc-9fd65",
    storageBucket: "strangers-fc-9fd65.firebasestorage.app",
    messagingSenderId: "501164375375",
    appId: "1:501164375375:web:ccfbcb3aee1f3381d6193a",
    measurementId: "G-XX206GPKX6"
};

// Returns true if valid Firebase credentials are provided
const isFirebaseConfigured = Boolean(
    FIREBASE_CONFIG &&
    FIREBASE_CONFIG.apiKey &&
    FIREBASE_CONFIG.apiKey.length > 5 &&
    FIREBASE_CONFIG.projectId &&
    FIREBASE_CONFIG.projectId.length > 2
);
