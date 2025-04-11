import { 
  auth, 
  db,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp 
} from './firebase-config.js';

// DOM Elements
const elements = {
  loginContainer: document.getElementById('login-container'),
  signupContainer: document.getElementById('signup-container'),
  showSignupLink: document.getElementById('show-signup'),
  showLoginLink: document.getElementById('show-login'),
  loginBtn: document.getElementById('login-btn'),
  signupBtn: document.getElementById('signup-btn'),
  googleLoginBtn: document.getElementById('google-login-btn'),
  googleSignupBtn: document.getElementById('google-signup-btn'),
  loginEmail: document.getElementById('login-email'),
  loginPassword: document.getElementById('login-password'),
  signupUsername: document.getElementById('signup-username'),
  signupEmail: document.getElementById('signup-email'),
  signupPassword: document.getElementById('signup-password'),
  signupConfirmPassword: document.getElementById('signup-confirm-password'),
  usernameDisplay: document.getElementById('username-display'),
  profilePic: document.getElementById('profile-pic'),
  profilePicContainer: document.getElementById('profile-pic-container'),
  authPages: document.getElementById('auth-pages'),
  accountManagement: document.getElementById('account-management'),
  usernameInput: document.getElementById('username-input'),
  profilePicUpload: document.getElementById('profile-pic-upload'),
  profilePicPreview: document.getElementById('profile-pic-preview'),
  saveChangesBtn: document.getElementById('save-changes-btn'),
  signOutBtn: document.getElementById('sign-out-btn')
};

// Constants
const DEFAULT_PROFILE_PIC = 'default-profile.png';
const MAX_IMAGE_SIZE_KB = 900; // 900KB (leaving room for other data in 1MB Firestore doc)

// Initialize UI
resetUI();

// Event Listeners
function initEventListeners() {
  elements.showSignupLink?.addEventListener('click', (e) => toggleAuthForms(e, 'signup'));
  elements.showLoginLink?.addEventListener('click', (e) => toggleAuthForms(e, 'login'));
  elements.loginBtn?.addEventListener('click', handleLogin);
  elements.signupBtn?.addEventListener('click', handleSignup);
  elements.googleLoginBtn?.addEventListener('click', handleGoogleSignIn);
  elements.googleSignupBtn?.addEventListener('click', handleGoogleSignIn);
  elements.signOutBtn?.addEventListener('click', () => signOut(auth));
  elements.saveChangesBtn?.addEventListener('click', handleSaveChanges);
  elements.profilePicContainer?.addEventListener('click', () => elements.profilePicUpload?.click());
  elements.profilePicUpload?.addEventListener('change', handleImageUpload);
}

// Toggle between login/signup forms
function toggleAuthForms(e, formToShow) {
  e.preventDefault();
  elements.loginContainer?.classList.toggle('hidden', formToShow !== 'login');
  elements.signupContainer?.classList.toggle('hidden', formToShow !== 'signup');
}

// Handle email/password login
async function handleLogin() {
  const email = elements.loginEmail.value.trim();
  const password = elements.loginPassword.value.trim();

  if (!validateFormFields([email, password])) {
    showError(elements.loginBtn, 'Please fill in all fields');
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    showError(elements.loginBtn, error.message);
  }
}

// Handle email/password signup
async function handleSignup() {
  const username = elements.signupUsername.value.trim();
  const email = elements.signupEmail.value.trim();
  const password = elements.signupPassword.value.trim();
  const confirmPassword = elements.signupConfirmPassword.value.trim();

  if (!validateFormFields([username, email, password, confirmPassword])) {
    showError(elements.signupBtn, 'Please fill in all fields');
    return;
  }

  if (password !== confirmPassword) {
    showError(elements.signupBtn, 'Passwords do not match');
    return;
  }

  if (password.length < 6) {
    showError(elements.signupBtn, 'Password must be at least 6 characters');
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await createUserDocument(userCredential.user, username);
  } catch (error) {
    showError(elements.signupBtn, error.message);
  }
}

// Handle Google Sign-In
async function handleGoogleSignIn() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const userDoc = await getDoc(doc(db, 'users', result.user.uid));
    if (!userDoc.exists()) {
      await createUserDocument(result.user);
    }
  } catch (error) {
    console.error('Google sign in error:', error);
    showError(elements.googleLoginBtn, 'Google sign in failed');
  }
}

// Create user document in Firestore
async function createUserDocument(user, username = null) {
  const userData = {
    username: username || user.displayName || user.email.split('@')[0],
    profilePicBase64: user.photoURL || '',
    email: user.email,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  await setDoc(doc(db, 'users', user.uid), userData);
}

// Handle profile changes
async function handleSaveChanges() {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const updates = {
      username: elements.usernameInput.value.trim(),
      updatedAt: serverTimestamp()
    };

    if (elements.profilePicUpload.files[0]) {
      updates.profilePicBase64 = await processImageFile(elements.profilePicUpload.files[0]);
    }

    await updateDoc(doc(db, 'users', user.uid), updates);
    showSuccess(elements.saveChangesBtn, 'Changes saved!');
  } catch (error) {
    showError(elements.saveChangesBtn, error.message);
  }
}

// Process image file (compress + convert to Base64)
async function processImageFile(file) {
  if (file.size / 1024 > MAX_IMAGE_SIZE_KB) {
    throw new Error(`Image must be smaller than ${MAX_IMAGE_SIZE_KB}KB`);
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 200;
        let { width, height } = calculateNewDimensions(img.width, img.height, MAX_SIZE);

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// Handle image upload preview
function handleImageUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    elements.profilePicPreview.src = event.target.result;
  };
  reader.readAsDataURL(file);
}

// Auth state listener
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // User signed in
    elements.authPages?.classList.add('hidden');
    elements.accountManagement?.classList.remove('hidden');

    const userDoc = await getDoc(doc(db, 'users', user.uid));
    updateUI(user, userDoc.exists() ? userDoc.data() : await createUserDocument(user));
  } else {
    // User signed out
    elements.authPages?.classList.remove('hidden');
    elements.accountManagement?.classList.add('hidden');
    toggleAuthForms(new Event('click'), 'login');
    resetUI();
  }
});

// Update UI with user data
function updateUI(user, userData) {
  if (elements.usernameDisplay) elements.usernameDisplay.textContent = userData.username || 'User';
  if (elements.usernameInput) elements.usernameInput.value = userData.username || '';
  
  const imageSrc = userData.profilePicBase64 || user.photoURL || DEFAULT_PROFILE_PIC;
  if (elements.profilePic) elements.profilePic.src = imageSrc;
  if (elements.profilePicPreview) {
    elements.profilePicPreview.src = userData.profilePicBase64 || '';
  }
}

// Reset UI to default state
function resetUI() {
  updateUI({}, { username: 'Guest', profilePicBase64: '' });
  if (elements.profilePicUpload) elements.profilePicUpload.value = '';
  clearFormFields();
}

// Helper functions
function validateFormFields(fields) {
  return fields.every(field => field.trim() !== '');
}

function calculateNewDimensions(width, height, maxSize) {
  if (width > height) {
    if (width > maxSize) {
      height *= maxSize / width;
      width = maxSize;
    }
  } else if (height > maxSize) {
    width *= maxSize / height;
    height = maxSize;
  }
  return { width, height };
}

function clearFormFields() {
  [
    elements.loginEmail,
    elements.loginPassword,
    elements.signupUsername,
    elements.signupEmail,
    elements.signupPassword,
    elements.signupConfirmPassword
  ].forEach(field => {
    if (field) field.value = '';
  });
}

function showError(element, message) {
  if (!element) return;
  
  const errorElement = document.createElement('p');
  errorElement.className = 'error-message';
  errorElement.textContent = message;
  element.after(errorElement);

  setTimeout(() => errorElement.remove(), 5000);
}

function showSuccess(element, message) {
  if (!element) return;
  
  const successElement = document.createElement('p');
  successElement.className = 'success-message';
  successElement.textContent = message;
  element.after(successElement);

  setTimeout(() => successElement.remove(), 5000);
}

// Initialize the app
initEventListeners();
