import firebase from 'firebase';
require('@firebase/firestore')

const firebaseConfig = {
  apiKey: "AIzaSyCI17baSDgKptR7NYxiavu94XUasCcUtmA",
  authDomain: "book-santa-5168a.firebaseapp.com",
  projectId: "book-santa-5168a",
  storageBucket: "book-santa-5168a.appspot.com",
  messagingSenderId: "1099113805395",
  appId: "1:1099113805395:web:34a306d98898de8c2db8a6"
};
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore();