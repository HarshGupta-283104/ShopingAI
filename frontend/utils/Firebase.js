import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: "AIzaSyBPh2-dRl47hUo0D3qrf5GdcAbozk66GiE",
  authDomain: "onecart-2fd37.firebaseapp.com",
  projectId: "onecart-2fd37",
  storageBucket: "onecart-2fd37.appspot.com",
  messagingSenderId: "585925847283",
  appId: "1:585925847283:web:35fe5408d2635375c86f86",
  measurementId: "G-XDHD228FGF",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
