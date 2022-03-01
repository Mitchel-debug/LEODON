// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, uploadBytes, uploadTask } from "firebase/storage";
import {
    getFirestore,
    collection,
    setDoc, onSnapshot, doc, getDoc, addDoc, getDocs, updateDoc, query, where, collectionGroup,
    orderBy, limit,
    arrayUnion,
    serverTimestamp 
} from "firebase/firestore"
import { 
    getAuth, 
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    signInWithEmailAndPassword,
    updateProfile 
} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBf566kx-eMv9bKNWWmspJnKySB5HRfbXc",
  authDomain: "leodon-cb3e7.firebaseapp.com",
  projectId: "leodon-cb3e7",
  storageBucket: "leodon-cb3e7.appspot.com",
  messagingSenderId: "645099591099",
  appId: "1:645099591099:web:4dacb1645e3486d82e209e",
  measurementId: "G-JJ59GJF13F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage();
const db = getFirestore();
const auth = getAuth();
const emailval = document.getElementById("signup-email2");
const passval = document.getElementById("signup-password2");
const usernameval = document.getElementById("user-val");
const sendBtn = document.querySelector(".hello");
var login = document.getElementById("register");
var login2 = document.getElementById("login");
const loginBtn = document.querySelector("#sub_btn");
const emailval2 = document.getElementById("signup-email");
const passval2 = document.getElementById("signup-password");
const upload = document.querySelector(".upload");

var currentUser = {};
var currentuid = {};

sendBtn.onclick = function(e){
    e.preventDefault();
    console.log("hello")
    var usernames = usernameval.value;
    var emil = emailval.value;
    var pass = passval.value;
    signUp(usernames, emil, pass);
}

function signUp(username, email, password){
    createUserWithEmailAndPassword(auth, email, password)
    .then( async (userCred) => {
        const userDat = userCred.user;
        console.log(userDat);
        login.reset();
        modal.style.display = "none";

        updateProfile(auth.currentUser, {
            displayName: username
        })
        
    })
    .catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage)
    })
}
loginBtn.onclick = function(e){
    e.preventDefault()
    var emil2 = emailval2.value;
    var pass2 = passval2.value;
    signIn(emil2, pass2);
}
function signIn(email, password){
    signInWithEmailAndPassword(auth, email, password)
    .then((userCred) => {
        const userDat2 = userCred.user;
        console.log(userDat2.displayName, "is logged in");
        login2.reset();
        modal.style.display = "none";
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage)
    });
}
function writeUserData(user){
    const colref = doc(db, "users", currentUser.uid);
    const newLocal = {
        userEmail: user.email,
        username: user.displayName,
        createdAt: moment().format("YYYY-MM-DD HH:mm")
    };
    setDoc(colref, newLocal)
}
onAuthStateChanged(auth, (user) => {
    if (user){
        currentUser = user;
        writeUserData(user);
        currentuid = user.uid;
        console.log(`${currentUser.email} is from auth changed`);
        console.log(`${user.displayName} is the name of the new user`);
        if (currentUser.email != "wee@gmail.com"){
        upload.style.display = "none"
        }
    } else {
        // User is signed out
        // ...
    //     signOut(auth).then(() => {
    //         console.log("USER is signed out")
    //     })
    }
})


upload.addEventListener("click", e=>{
    const namebox = document.querySelector("#namebox").files[0];
    const storageRef = ref(storage, namebox.name);
    const uploadTask = uploadBytesResumable(storageRef, namebox)
    // .then((snapshot) => {
    //     getDownloadURL(snapshot.ref).then((url) => {
    //         console.log("file available at", url);
    //     });
    //     console.log("File metadata", snapshot.metadata);
    // })
    uploadTask.on("state_changed", (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
                case 'paused':
                console.log('Upload is paused');
                break;
                case 'running':
                console.log('Upload is running');
                break;
            }
    }), 
    (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
        case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;
        case 'storage/canceled':
            // User canceled the upload
            break;
    
        // ...
    
        case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
    }, 
    () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log('File available at', downloadURL);
        });
    }
   
    




})

var modal = document.getElementById("myModal");

var btn = document.getElementById("myBtn");
var span = document.getElementsByClassName("close")[0];
btn.onclick = function() {
    modal.style.display = "block";
}
  
// When the user clicks on <span> (x), close the modal
span.onclick = function() {
modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
// window.onclick = function(event) {
//     if (event.target == modal) {
//         modal.style.display = "none";
//     }
// }


var uplad = document.getElementById("myUpload");

var btn3 = document.getElementById("modal2");
var span3 = document.getElementsByClassName("cancel")[0];
btn3.onclick = function() {
    uplad.style.display = "block";
}
  
// When the user clicks on <span> (x), close the modal
span3.onclick = function() {
uplad.style.display = "none";
}

// // When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == uplad) {
        uplad.style.display = "none";
    }
}























// const api_key = "c676704f7f38e65d7b9a18478a49d59f";
// const image_url = "https://image.tmdb.org/t/p/w500"

// const url = "https://api.themoviedb.org/3/search/movie?api_key=c676704f7f38e65d7b9a18478a49d59f"
// const searchbutton = document.querySelector("#search");
// const inputElem = document.querySelector("#searchbar");
// const movieSearchable = document.querySelector(".movies");


// function movieSection(movies){
//     return movies.map((movie) => {
//         if(movie.poster_path){    
//             return`
//                     <img src=${image_url + movie.poster_path} data-movie-id=${movie.id}/>
//                     `;
//             }
//         })
// }

// function createMovie(movies) {
//     const movieElem = document.createElement("div");
//     movieElem.setAttribute("class", "movie");

//     const movieTemplate = `
//     <section class="section">
//         ${ movieSection(movies)}
//     </section>
//     <div class="content">
//         <p id="content-close">X</p>
//     </div>
//     `;
//     movieElem.innerHTML = movieTemplate;
//     return movieElem;
// }
// searchbutton.onclick = function(event){
//     event.preventDefault()
//     const value = inputElem.value;

//     const newUrl = url + "&query=" + value;
//     fetch(newUrl)
//     .then((res) => res.json())
//     .then((data) => {
//         const movies = data.results;
//         const movieBlock = createMovie(movies);
//         movieSearchable.appendChild(movieBlock)
//         console.log("Data:", data)
//     })
//     .catch((error) => {
//         console.log("Error", error);
//     })
//     console.log("Value:", value)
// }