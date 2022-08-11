import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

var firebaseConfig = {
  apiKey: "AIzaSyD7g2k0wBbDxK2Ax-qtL-VokX1JJ_0Vw9E",
  authDomain: "next-js-blog-61159.firebaseapp.com",
  projectId: "next-js-blog-61159",
  storageBucket: "next-js-blog-61159.appspot.com",
  messagingSenderId: "340858267274",
  appId: "1:340858267274:web:d81a07cb6822749a7e2f73",
  measurementId: "G-9WB8LK5429"
  };


if(!firebase.apps.length) firebase.initializeApp(firebaseConfig)


const auth  = firebase.auth()
const db = firebase.firestore()
const storage = firebase.storage()
const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp

export {auth,db,storage,serverTimestamp}


