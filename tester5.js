import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-analytics.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";
import { getDatabase, ref as dbRef, set, get } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDQcJNa_j_PC3-K5er4ms0WvVXQS_CEcuE",
    authDomain: "algebras4-44f23.firebaseapp.com",
    projectId: "algebras4-44f23",
    storageBucket: "algebras4-44f23.appspot.com",
    messagingSenderId: "512062724744",
    appId: "1:512062724744:web:653e3c7a504fb7255fdd3d",
    measurementId: "your-measurement-id"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);
const database = getDatabase(app);

let currentUser;

async function loadUserData(uid) {
    const userRef = dbRef(database, `users/${uid}`);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
        const userData = snapshot.val();
        document.getElementById('user-bio').textContent = userData.bio || "No bio yet.";
        displayUserInfo(currentUser.displayName, userData.photoURL || "images/IMG_0164.jpeg");
    } else {
        document.getElementById('user-bio').textContent = "No bio yet.";
        displayUserInfo("Guest", "images/IMG_0164.jpeg");
    }
}

onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUser = user;

        // Load user data (bio and profile picture) from the database
        await loadUserData(user.uid);

        // Show the upload and save bio buttons
        toggleButtons(true);
    } else {
        // User is signed out
        toggleButtons(false);
        displayUserInfo("Guest", "images/IMG_0164.jpeg");
        document.getElementById('user-bio').textContent = "No bio yet.";
    }
});

document.getElementById('login').addEventListener('click', () => {
    signInWithPopup(auth, provider)
        .then(async (result) => {
            const user = result.user;
            currentUser = user;

            // Load user data from the database
            await loadUserData(user.uid);
        })
        .catch((error) => {
            console.error('Error during sign-in:', error);
        });
});

document.getElementById('logout').addEventListener('click', () => {
    signOut(auth).then(() => {
        // Reset the display when signed out
        displayUserInfo("Guest", "images/IMG_0164.jpeg");
        document.getElementById('user-bio').textContent = "No bio yet.";
        toggleButtons(false);
    }).catch((error) => {
        console.error('Error during sign-out:', error);
    });
});

document.getElementById('uploadBtn').addEventListener('click', async () => {
    const file = document.getElementById('fileInput').files[0];

    if (!file) {
        alert("Please select a file first.");
        return;
    }

    if (!currentUser) {
        alert("You must be logged in to upload a profile picture.");
        return;
    }

    const storageRef = ref(storage, `profilePictures/${currentUser.uid}.jpeg`);

    try {
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        // Store the profile picture URL in the database
        const userRef = dbRef(database, `users/${currentUser.uid}`);
        await set(userRef, { photoURL: downloadURL });

        // Update display and local storage
        displayUserInfo(currentUser.displayName, downloadURL);
        localStorage.setItem('userPhoto', downloadURL);
    } catch (error) {
        console.error("Error uploading file:", error);
    }
});

document.getElementById('save-bio').addEventListener('click', async () => {
    const bio = document.getElementById('bio-input').value;

    if (!currentUser) {
        alert("You must be logged in to save a bio.");
        return;
    }

    const userRef = dbRef(database, `users/${currentUser.uid}`);
    await set(userRef, { bio });

    document.getElementById('user-bio').textContent = bio;
    alert("Bio saved!");
});

function displayUserInfo(name, photoURL) {
    document.getElementById('user-name').textContent = name;
    document.getElementById('user-pic-center').src = photoURL;
    document.getElementById('user-pic-top-right').src = photoURL;
}

function toggleButtons(isLoggedIn) {
    const elementsToHide = ['uploadBtn', 'save-bio', 'fileInput', 'bio-input', 'logout'];
    elementsToHide.forEach(id => {
        document.getElementById(id).style.display = isLoggedIn ? 'inline' : 'none';
    });

    document.getElementById('login').style.display = isLoggedIn ? 'none' : 'inline';
}