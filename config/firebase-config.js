import Constants from "expo-constants";
import { initializeApp } from "firebase/app";

const {
  firebase: {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
  },
} = Constants.manifest.extra;

const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
};

export const firebaseApp = initializeApp(firebaseConfig);
