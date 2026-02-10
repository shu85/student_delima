// Firebase Configuration
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyDPLmLAEHSdxXjN-SiyIjo9HbpJuQ1mEVg",
  authDomain: "kns-hub-412a6.firebaseapp.com",
  projectId: "kns-hub-412a6",
  storageBucket: "kns-hub-412a6.firebasestorage.app",
  messagingSenderId: "404861589600",
  appId: "1:404861589600:web:03753ff77f32c5c0150b05",
  measurementId: "G-5SFK7Z5T5E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
