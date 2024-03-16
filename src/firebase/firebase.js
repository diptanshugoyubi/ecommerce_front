// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBP76jT_Zy_JrjA-dVv7qL5elZfx-0n1k8",
  authDomain: "ecommerceyubi.firebaseapp.com",
  projectId: "ecommerceyubi",
  storageBucket: "ecommerceyubi.appspot.com",
  messagingSenderId: "780718026857",
  appId: "1:780718026857:web:3368120242ca61c2cf72f8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage, app};