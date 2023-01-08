

import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBtWMM9BMmwjaP5pdShxPC8kDPZ2uAz8Ow",
  authDomain: "fir-dc116.firebaseapp.com",
  projectId: "fir-dc116",
  storageBucket: "fir-dc116.appspot.com",
  messagingSenderId: "213251598321",
  appId: "1:213251598321:web:37745482a97cac4404c650",
  measurementId: "G-2CTQ8ZLMVS"
};

const app = firebase.initializeApp(firebaseConfig)
const auth=firebase.auth()
const db=app.firestore()

export {auth,db}
