// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBtJ4sVMBkoZ8HTjZABGr5Lfwq6GuLGkLc",
    authDomain: "pantryapp-19dba.firebaseapp.com",
    projectId: "pantryapp-19dba",
    storageBucket: "pantryapp-19dba.appspot.com",
    messagingSenderId: "1002340612853",
    appId: "1:1002340612853:web:4ac4f1f9f6b95af29ca3bc",
    measurementId: "G-N4CQ79G1X8"
  };
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };