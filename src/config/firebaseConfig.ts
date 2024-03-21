import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage, ref as refStorage, uploadBytes, listAll, getDownloadURL, deleteObject } from "firebase/storage";
import { getDatabase, ref, push, onValue } from "firebase/database";
import { serverTimestamp } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAi7QITb96GST6WxPbTHLV07JR9IFGqAg8",
  authDomain: "artvista-e8fb1.firebaseapp.com",
  databaseURL: "https://artvista-e8fb1-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "artvista-e8fb1",
  storageBucket: "artvista-e8fb1.appspot.com",
  messagingSenderId: "169021615704",
  appId: "1:169021615704:web:e0fbae91ea3a748d46a42d",
  measurementId: "G-XY94YLM2Y5"
};

const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth();
export const firebaseStorage = getStorage(app);
const database = getDatabase(app);
export { database, ref, push, onValue, serverTimestamp, uploadBytes, listAll, getDownloadURL, refStorage, deleteObject };
