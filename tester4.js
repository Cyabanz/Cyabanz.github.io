// Check authentication state
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        const storedName = localStorage.getItem('userName');
        const storedPhoto = localStorage.getItem('userPhoto');
        
        if (storedName && storedPhoto) {
            displayUserInfo(storedName, storedPhoto);
        } else {
            displayUserInfo(user.displayName, user.photoURL);
            // Save user info to localStorage
            localStorage.setItem('userName', user.displayName);
            localStorage.setItem('userPhoto', user.photoURL);
        }
    } else {
        // User is signed out
        displayUserInfo("Guest", "images/IMG_0164.jpeg"); // Default picture
    }
});

// Handle login
document.getElementById('login').addEventListener('click', () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            displayUserInfo(user.displayName, user.photoURL);
            
            // Save user info to localStorage
            localStorage.setItem('userName', user.displayName);
            localStorage.setItem('userPhoto', user.photoURL);
        })
        .catch((error) => {
            console.error('Error during sign-in:', error);
        });
});

// Handle logout
document.getElementById('logout').addEventListener('click', () => {
    signOut(auth).then(() => {
        displayUserInfo("Guest", "images/IMG_0164.jpeg"); // Default picture
        // Clear localStorage on logout
        localStorage.removeItem('userName');
        localStorage.removeItem('userPhoto');
    }).catch((error) => {
        console.error('Error during sign-out:', error);
    });
});

// Function to display user info
function displayUserInfo(name, photoURL) {
    document.getElementById('user-name').textContent = name;
    document.getElementById('user-pic-top-right').src = photoURL; // Top-right profile picture
    document.getElementById('user-pic-center').src = photoURL; // Center Google profile picture

    // Toggle button visibility
    if (name === "Guest") {
        document.getElementById('login').style.display = 'inline';
        document.getElementById('logout').style.display = 'none';
    } else {
        document.getElementById('login').style.display = 'none';
        document.getElementById('logout').style.display = 'inline';
    }
}

// Upload profile picture function
document.getElementById('uploadBtn').addEventListener('click', async () => {
    const file = document.getElementById('fileInput').files[0];

    if (!file) {
        alert("Please select a file first.");
        return;
    }

    const storageRef = ref(storage, `profilePictures/${file.name}`);

    try {
        // Upload the file to Firebase Storage
        await uploadBytes(storageRef, file);
        console.log("File uploaded successfully!");

        // Get the download URL
        const downloadURL = await getDownloadURL(storageRef);
        console.log("File available at:", downloadURL);

        // Display the uploaded profile picture
        displayUserInfo(user.displayName, downloadURL); // Update the user picture

        // Save the new profile picture URL to local storage
        localStorage.setItem('userPhoto', downloadURL);
    } catch (error) {
        console.error("Error uploading file:", error);
    }
});