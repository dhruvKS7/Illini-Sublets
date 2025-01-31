// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "",
  authDomain: "test-bf8dd.firebaseapp.com",
  projectId: "test-bf8dd",
  storageBucket: "test-bf8dd.appspot.com",
  messagingSenderId: "148906830991",
  appId: "1:148906830991:web:beffe40ede21a3316494fa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;