import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'


const firebaseConfig = {
  apiKey: "AIzaSyD0RxWWJzF2n2X_TTf14K5W4-qNLxEit-I",
  authDomain: "food230-2026.firebaseapp.com",
  projectId: "food230-2026",
  storageBucket: "food230-2026.firebasestorage.app",
  messagingSenderId: "994435510236",
  appId: "1:994435510236:web:945967aa78c6dea4416919",
  measurementId: "G-7B06TLLXMC"
};

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const storage = getStorage(app)
