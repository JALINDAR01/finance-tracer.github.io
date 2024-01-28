// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore,doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB9rpLs5utwQRhE9PWo_I_5waQslIlbXLw",
  authDomain: "financely-c704f.firebaseapp.com",
  projectId: "financely-c704f",
  storageBucket: "financely-c704f.appspot.com",
  messagingSenderId: "1020706125972",
  appId: "1:1020706125972:web:e61ec1fd0e0ea3b8499c81",
  measurementId: "G-BBTZCPL459"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore (app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { db, auth, provider, doc, setDoc };