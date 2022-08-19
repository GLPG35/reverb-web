import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-app.js";
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
    apiKey: "AIzaSyDIddKsbkz8MpqQX3sIjtAozy6_UmlU7bQ",
    authDomain: "reverb-web-app.firebaseapp.com",
    projectId: "reverb-web-app",
    storageBucket: "reverb-web-app.appspot.com",
    messagingSenderId: "782158261364",
    appId: "1:782158261364:web:8d61d0530f47f4a3bcf521"
};

const app = initializeApp(firebaseConfig);