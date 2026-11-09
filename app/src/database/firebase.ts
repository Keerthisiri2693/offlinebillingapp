import { initializeApp } from 'firebase/app';
import { getFirestore,  doc,
  setDoc,
  getDoc, } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB26n95_T5zV8orHRA7jUYY6eWOAPtHVFw",
  authDomain: "astbillingadmin.firebaseapp.com",
  projectId: "astbillingadmin",
  storageBucket: "astbillingadmin.appspot.com",
  messagingSenderId: "991042569768",
  appId: "1:991042569768:web:0b5921f0b921cb8004971d",
  
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export {
  doc,
  setDoc,
  getDoc,
};