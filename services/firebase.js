import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

var firebaseConfig = {
  apiKey: "AIzaSyDjLS40Ys69a7TbIFgP3xzv0Vs7ObLdIWI",
  authDomain: "bisu-portal.firebaseapp.com",
  projectId: "bisu-portal",
  storageBucket: "bisu-portal.appspot.com",
  messagingSenderId: "661417036971",
  appId: "1:661417036971:web:75fb9212ab41b4ba193bee",
  measurementId: "G-91F2JZVLQ6"
};

// Initialize Firebase
if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig);
}
// // firebase.analytics();
export const db = firebase.firestore();
export const storage = firebase.storage();
export const auth = firebase.auth;
