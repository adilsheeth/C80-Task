import firebase from "firebase";

const firebaseConfig = {

    apiKey: "AIzaSyAyNnQDuxRX9KJEsXrlOy-BNx5rXecoJHQ",
  
    authDomain: "elib-d6800.firebaseapp.com",
  
    projectId: "elib-d6800",
  
    storageBucket: "elib-d6800.appspot.com",
  
    messagingSenderId: "626037403215",
    appId: "1:626037403215:web:2292d9488f8442bb23443a"
};
  

firebase.initializeApp(firebaseConfig);

export default firebase.firestore();