// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDpTbp0jYsd50M1qWdeDj4P5v9bwsMZDvM",
    authDomain: "board-40e72.firebaseapp.com",
    projectId: "board-40e72",
    storageBucket: "board-40e72.appspot.com",
    messagingSenderId: "831882756116",
    appId: "1:831882756116:web:8c5b015de9994d506ee701",
    measurementId: "G-G199D09ZXC"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const storage = getStorage(app)