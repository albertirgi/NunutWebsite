import admin from 'firebase-admin'
import serviceAccount from "../nunut-da274-firebase-adminsdk-e1ye1-694ad5da09.json" assert { type: 'json' }
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCDWfxpMDbrz3poshF-vgNc2TBW3IyqStU",
  authDomain: "nunut-da274.firebaseapp.com",
  projectId: "nunut-da274",
  storageBucket: "nunut-da274.appspot.com",
  messagingSenderId: "453751060369",
  appId: "1:453751060369:web:9015118dff91d03e1b4c30",
  measurementId: "G-KWEFP8VFD7",
  credential: admin.credential.cert(serviceAccount)
};

// Initialize Firebase
const db = admin.initializeApp(firebaseConfig);

export { firebaseConfig, db }
