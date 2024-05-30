import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAMNtgR0hRMTh3zFrOEhfpPUHammmk1SN8",
    authDomain: "new-app-960e3.firebaseapp.com",
    projectId: "new-app-960e3",
    storageBucket: "new-app-960e3.appspot.com",
    messagingSenderId: "167186675117",
    appId: "1:167186675117:web:06e143323d9c8f2396dd24"
  };

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();