import { auth, db } from './firebase-config.js';

// DOM Elements
const loginContainer = document.getElementById('login-container');
const signupContainer = document.getElementById('signup-container');
const showSignupLink = document.getElementById('show-signup');
const showLoginLink = document.getElementById('show-login');
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const googleLoginBtn = document.getElementById('google-login-btn');
const googleSignupBtn = document.getElementById('google-signup-btn');
const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');
const signupUsername = document.getElementById('signup-username');
const signupEmail = document.getElementById('signup-email');
const signupPassword = document.getElementById('signup-password');
const signupConfirmPassword = document.getElementById('signup-confirm-password');
const usernameDisplay = document.getElementById('username-display');
const profilePic = document.getElementById('profile-pic');
const profilePicContainer = document.getElementById('profile-pic-container');
const authPages = document.getElementById('auth-pages');
const accountManagement = document.getElementById('account-management');
const usernameInput = document.getElementById('username-input');
const profilePicUpload = document.getElementById('profile-pic-upload');
const profilePicPreview = document.getElementById('profile-pic-preview');
const saveChangesBtn = document.getElementById('save-changes-btn');
const signOutBtn = document.getElementById('sign-out-btn');

// Default profile picture
const DEFAULT_PROFILE_PIC = 'default-profile.png';

// Initialize UI
resetUI();

// Toggle between login and signup forms
showSignupLink?.addEventListener('click', (e) => {
    e.preventDefault();
    loginContainer.classList.add('hidden');
    signupContainer.classList.remove('hidden');
});

showLoginLink?.addEventListener('click', (e) => {
    e.preventDefault();
    signupContainer.classList.add('hidden');
    loginContainer.classList.remove('hidden');
});

// Email/Password Login
loginBtn?.addEventListener('click', async () => {
    const email = loginEmail.value.trim();
    const password = loginPassword.value.trim();

    if (!email || !password) {
        showError(loginBtn, 'Please fill in all fields');
        return;
    }

    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        showError(loginBtn, error.message);
    }
});

// Email/Password Signup
signupBtn?.addEventListener('click', async () => {
    const username = signupUsername.value.trim();
    const email = signupEmail.value.trim();
    const password = signupPassword.value.trim();
    const confirmPassword = signupConfirmPassword.value.trim();

    // Validation
    if (!username || !email || !password || !confirmPassword) {
        showError(signupBtn, 'Please fill in all fields');
        return;
    }

    if (password !== confirmPassword) {
        showError(signupBtn, 'Passwords do not match');
        return;
    }

    if (password.length < 6) {
        showError(signupBtn, 'Password must be at least 6 characters');
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Create user document with empty profile picture
        await setDoc(doc(db, 'users', user.uid), {
            username: username,
            profilePicBase64: '',
            email: email,
            createdAt: serverTimestamp()
        });

        updateUI(user, {
            username: username,
            profilePicBase64: ''
        });
    } catch (error) {
        showError(signupBtn, error.message);
    }
});

// Google Sign-In
async function handleGoogleSignIn() {
    const provider = new GoogleAuthProvider();
    try {
        await signInWithPopup(auth, provider);
    } catch (error) {
        console.error('Google sign in error:', error);
        showError(googleLoginBtn, 'Google sign in failed');
    }
}

googleLoginBtn?.addEventListener('click', handleGoogleSignIn);
googleSignupBtn?.addEventListener('click', handleGoogleSignIn);

// Sign Out
signOutBtn?.addEventListener('click', () => {
    signOut(auth);
});

// Auth state listener
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // User is signed in
        authPages?.classList.add('hidden');
        accountManagement?.classList.remove('hidden');
        
        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (userDoc.exists()) {
            updateUI(user, userDoc.data());
        } else {
            // New user - create document
            const username = user.displayName || user.email.split('@')[0];
            await setDoc(doc(db, 'users', user.uid), {
                username: username,
                profilePicBase64: '',
                email: user.email,
                createdAt: serverTimestamp()
            });
            updateUI(user, {
                username: username,
                profilePicBase64: ''
            });
        }
    } else {
        // User is signed out
        authPages?.classList.remove('hidden');
        accountManagement?.classList.add('hidden');
        loginContainer?.classList.remove('hidden');
        signupContainer?.classList.add('hidden');
        resetUI();
    }
});

// Save profile changes
saveChangesBtn?.addEventListener('click', async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
        let profilePicBase64 = '';
        const file = profilePicUpload.files[0];

        if (file) {
            // Compress and convert to Base64
            profilePicBase64 = await processImageFile(file);
            
            // Check size (Firestore document limit is 1MB)
            if (profilePicBase64.length > 900000) { // Leave room for other data
                throw new Error('Image is too large. Please use a smaller image (max 500KB).');
            }
        }

        // Update Firestore
        const updates = {
            username: usernameInput.value.trim(),
            updatedAt: serverTimestamp()
        };

        if (profilePicBase64) {
            updates.profilePicBase64 = profilePicBase64;
        }

        await updateDoc(doc(db, 'users', user.uid), updates);

        // Update UI
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
            updateUI(user, userDoc.data());
        }

        showSuccess(saveChangesBtn, 'Changes saved successfully!');
    } catch (error) {
        console.error('Error saving changes:', error);
        showError(saveChangesBtn, error.message);
    }
});

// Process image file (compress and convert to Base64)
function processImageFile(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 200;
                const MAX_HEIGHT = 200;
                let width = img.width;
                let height = img.height;

                // Calculate new dimensions
                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                // Resize and compress
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Convert to Base64 with quality compression
                resolve(canvas.toDataURL('image/jpeg', 0.7));
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });
}

// Update UI with user data
function updateUI(user, userData) {
    if (usernameDisplay) usernameDisplay.textContent = userData.username || 'User';
    if (usernameInput) usernameInput.value = userData.username || '';
    
    // Priority: 1. Base64 image, 2. Google photo, 3. Default
    const imageSrc = userData.profilePicBase64 || user.photoURL || DEFAULT_PROFILE_PIC;
    if (profilePic) profilePic.src = imageSrc;
    if (profilePicPreview) profilePicPreview.src = userData.profilePicBase64 || '';
}

// Reset UI to default state
function resetUI() {
    if (usernameDisplay) usernameDisplay.textContent = 'Guest';
    if (profilePic) profilePic.src = DEFAULT_PROFILE_PIC;
    if (profilePicPreview) profilePicPreview.src = '';
    
    // Clear form fields
    if (loginEmail) loginEmail.value = '';
    if (loginPassword) loginPassword.value = '';
    if (signupUsername) signupUsername.value = '';
    if (signupEmail) signupEmail.value = '';
    if (signupPassword) signupPassword.value = '';
    if (signupConfirmPassword) signupConfirmPassword.value = '';
    if (usernameInput) usernameInput.value = '';
    if (profilePicUpload) profilePicUpload.value = '';
}

// Profile picture click to open file dialog
profilePicContainer?.addEventListener('click', () => {
    profilePicUpload?.click();
});

// Preview selected image before upload
profilePicUpload?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            if (profilePicPreview) profilePicPreview.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Helper function to show error messages
function showError(element, message) {
    if (!element) return;
    
    const existingError = element.nextElementSibling;
    if (existingError && existingError.classList.contains('error-message')) {
        existingError.remove();
    }

    const errorElement = document.createElement('p');
    errorElement.classList.add('error-message');
    errorElement.textContent = message;
    element.parentNode.insertBefore(errorElement, element.nextSibling);

    setTimeout(() => {
        errorElement.remove();
    }, 5000);
}

// Helper function to show success messages
function showSuccess(element, message) {
    if (!element) return;
    
    const existingSuccess = element.nextElementSibling;
    if (existingSuccess && existingSuccess.classList.contains('success-message')) {
        existingSuccess.remove();
    }

    const successElement = document.createElement('p');
    successElement.classList.add('success-message');
    successElement.textContent = message;
    element.parentNode.insertBefore(successElement, element.nextSibling);

    setTimeout(() => {
        successElement.remove();
    }, 5000);
}