// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCZ-fbSupwc-aCBhWvz8TOyzMs5M8dy7sU',
  authDomain: 'sms-newsletter-4474a.firebaseapp.com',
  projectId: 'sms-newsletter-4474a',
  storageBucket: 'sms-newsletter-4474a.appspot.com',
  messagingSenderId: '706605590157',
  appId: '1:706605590157:web:623bf7a84ae6449fc9e4c4',
  measurementId: 'G-9TNC6YDKTE',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
