// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDNUmJcXRL_6pkqpCRwiZ5V9m0d_K28GQo",
  authDomain: "chatsite-f0fb9.firebaseapp.com",
  projectId: "chatsite-f0fb9",
  storageBucket: "chatsite-f0fb9.firebasestorage.app",
  messagingSenderId: "834593399363",
  appId: "1:834593399363:web:d60c035f9fe86fd16e2af6"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
