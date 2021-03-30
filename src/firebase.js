import firebase from "firebase";
const firebaseConfig = {
  apiKey: "AIzaSyCmu52QpMwIcbZejDUoMQcAMj95ZJcD-6I",
  authDomain: "catlogbeta-2-4.firebaseapp.com",
  projectId: "catlogbeta-2-4",
  storageBucket: "catlogbeta-2-4.appspot.com",
  messagingSenderId: "40048073929",
  appId: "1:40048073929:web:ec9d40b424d7f919088118",
  measurementId: "G-RJKQS4F4V4"
};

// firebase.functions().useEmulator("localhost", 5001);
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const storage = firebaseApp.storage();
const functions = firebaseApp.functions();

const devmode = false;

if (devmode) {
  // db.useEmulator("localhost", 8080);
  auth.useEmulator("http://localhost:9099");
  functions.useEmulator("localhost", 5001);
}

export {
  firebaseApp,
  db,
  storage,
  auth,
  functions
};
