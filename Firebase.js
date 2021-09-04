// For Firebase JS SDK v7.20.0 and later, measurementId is optional

//this is a snippet of code for the firebase


  import firebase from "firebase";
  const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCOVPyDHi46RFFeJZ6B8LLhXbRh5w3aRCE",
    authDomain: "instagram-clone-c9e13.firebaseapp.com",
    projectId: "instagram-clone-c9e13",
    storageBucket: "instagram-clone-c9e13.appspot.com",
    messagingSenderId: "972504799498",
    appId: "1:972504799498:web:da80e029d7caad4f4002f3",
    measurementId: "G-6WVTVTWTCC"
  });
  

  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();

  export{db,auth,storage};