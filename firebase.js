import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyCbURXywQfxn6CeaMr8XzieYjWl3lXibrc",
    authDomain: "any-messenger-dcdf1.firebaseapp.com",
    projectId: "any-messenger-dcdf1",
    storageBucket: "any-messenger-dcdf1.appspot.com",
    messagingSenderId: "953650777502",
    appId: "1:953650777502:web:ee07f666eaf55788bada8f"
};

const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };