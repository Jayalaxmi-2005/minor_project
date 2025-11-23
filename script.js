// ============================================
// SECTION VISIBILITY MANAGEMENT
// ============================================

// Store detected signs for audio output feature
let detectedSignsHistory = [];

// Initialize section visibility on page load
document.addEventListener('DOMContentLoaded', function() {
    // Only run on index.html (main page)
    if (document.getElementById('home')) {
        // Hide all sections except Home by default
        const sectionsToHide = ['features', 'detection', 'add-sign', 'about', 'contact'];
        sectionsToHide.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                section.style.display = 'none';
            }
        });
        
        // Ensure Home is visible
        const homeSection = document.getElementById('home');
        if (homeSection) {
            homeSection.style.display = 'block';
        }
        
        // Initialize other features
        initializeNavigation();
        checkLoginStatus();
        initializeUploadHandlers();
        updateAudioOutputDisplay();
        
        // Set home as active on page load
        updateActiveNavLink('home');
    }
    
    // Initialize hamburger menu for login/create account pages
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
});

// Show only the selected section and hide all others
function showSection(sectionId) {
    const allSections = ['home', 'features', 'detection', 'add-sign', 'about', 'contact'];
    
    allSections.forEach(id => {
        const section = document.getElementById(id);
        if (section) {
            if (id === sectionId) {
                // Show section with fade-in animation
                section.style.display = 'block';
                section.classList.add('visible');
                section.classList.remove('hidden');
                section.style.opacity = '0';
                section.style.transform = 'translateY(20px)';
                
                // Trigger fade-in animation
                setTimeout(() => {
                    section.style.opacity = '1';
                    section.style.transform = 'translateY(0)';
                }, 10);
                
                // Special handling for detection section - prepare camera
                if (id === 'detection') {
                    // Ensure camera frame is visible when section opens
                    const cameraFrame = document.getElementById('cameraFrame');
                    const outputContainer = document.getElementById('outputContainer');
                    const audioOutputDetection = document.getElementById('audioOutputDetection');
                    const video = document.getElementById('video');
                    const cameraPlaceholder = cameraFrame ? cameraFrame.querySelector('.camera-placeholder') : null;
                    const startBtn = document.getElementById('startBtn');
                    const stopBtn = document.getElementById('stopBtn');
                    
                    if (cameraFrame) {
                        cameraFrame.style.display = 'block';
                    }
                    
                    // Output container and audio output stay hidden until detection starts
                    if (outputContainer) {
                        outputContainer.style.display = 'none';
                    }
                    if (audioOutputDetection) {
                        audioOutputDetection.style.display = 'none';
                    }
                    
                    // Show camera placeholder and start button - user must click to start
                    if (!isDetecting) {
                        if (cameraPlaceholder) {
                            cameraPlaceholder.style.display = 'flex';
                        }
                        if (startBtn) {
                            startBtn.style.display = 'inline-block';
                            startBtn.disabled = false;
                        }
                        if (stopBtn) {
                            stopBtn.style.display = 'none';
                        }
                        if (video) {
                            video.style.display = 'none';
                        }
                    } else {
                        // If already detecting, ensure UI is correct
                        if (startBtn) startBtn.style.display = 'none';
                        if (stopBtn) stopBtn.style.display = 'inline-block';
                    }
                }
            } else {
                // Hide section with fade-out animation
                section.style.opacity = '0';
                section.style.transform = 'translateY(20px)';
                section.classList.remove('visible');
                section.classList.add('hidden');
                setTimeout(() => {
                    section.style.display = 'none';
                }, 300);
            }
        }
    });
    
    // Update active nav link
    updateActiveNavLink(sectionId);
    
    // Scroll to top of page for smooth transition
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Update active navigation link
function updateActiveNavLink(sectionId) {
    // Update navbar links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === `#${sectionId}`) {
            link.classList.add('active');
        }
    });
    
    // Update sidebar links
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.classList.remove('active');
        const href = item.getAttribute('href');
        if (href === `#${sectionId}` || (sectionId === 'home' && href === '#home')) {
            item.classList.add('active');
        }
    });
    
    // Ensure proper active state styling
    const activeLinks = document.querySelectorAll('.nav-link.active, .sidebar-item.active');
    activeLinks.forEach(link => {
        link.style.transition = 'all 0.3s ease';
    });
    
    // If showing home, make sure home link is active
    if (sectionId === 'home') {
        const homeLink = document.querySelector('.nav-link[href="#home"]');
        if (homeLink) {
            homeLink.classList.add('active');
        }
    }
}

// ============================================
// NAVIGATION HANDLERS
// ============================================

function initializeNavigation() {
    // Handle navbar link clicks
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                const sectionId = href.substring(1);
                showSection(sectionId);
                
                // Close mobile menu if open
                const hamburger = document.getElementById('hamburger');
                const navMenu = document.getElementById('navMenu');
                if (hamburger && navMenu) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            }
        });
    });
    
    // Handle sidebar link clicks
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const sectionId = href.substring(1);
                showSection(sectionId);
                
                // Special handling for detection section - ensure it's ready
                if (sectionId === 'detection') {
                    // Section will be shown by showSection, camera frame will be visible
                    // User needs to click Start Detection to open camera
                }
                
                // Close mobile sidebar if open
                if (window.innerWidth <= 768) {
                    const sidebar = document.getElementById('sidebar');
                    if (sidebar) {
                        sidebar.classList.remove('active');
                        document.body.classList.remove('sidebar-open');
                    }
                }
            }
        });
    });
    
    // Handle feature card clicks for Live Detection
    document.querySelectorAll('.feature-card').forEach(card => {
        const cardTitle = card.querySelector('h3');
        if (cardTitle && cardTitle.textContent === 'Live Detection') {
            card.addEventListener('click', function() {
                showSection('detection');
            });
        }
    });
}

// Smooth Scroll to Section (for hero button)
function scrollToSection(sectionId) {
    showSection(sectionId);
}

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================

window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ============================================
// HAMBURGER MENU
// ============================================

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// ============================================
// LIVE DETECTION SECTION
// ============================================

let stream = null;
let isDetecting = false;
let currentDetection = '';
let detectionInterval = null;

// Start Detection
async function startDetection() {
    const video = document.getElementById('video');
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const cameraFrame = document.getElementById('cameraFrame');
    const cameraPlaceholder = cameraFrame ? cameraFrame.querySelector('.camera-placeholder') : null;
    const outputContainer = document.getElementById('outputContainer');
    const outputText = document.getElementById('outputText');
    const speakBtn = document.getElementById('speakBtn');
    
    try {
        // Request camera access
        stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                width: { ideal: 1280 },
                height: { ideal: 720 },
                facingMode: 'user'
            } 
        });

        if (video) {
            video.srcObject = stream;
            video.style.display = 'block';
        }
        if (cameraPlaceholder) {
            cameraPlaceholder.style.display = 'none';
        }

        // Show output container with fade-in
        if (outputContainer) {
            outputContainer.style.display = 'block';
            outputContainer.style.opacity = '0';
            outputContainer.style.transform = 'translateY(10px)';
            setTimeout(() => {
                outputContainer.style.opacity = '1';
                outputContainer.style.transform = 'translateY(0)';
            }, 10);
        }
        
        // Show audio output detection below sign detection
        const audioOutputDetection = document.getElementById('audioOutputDetection');
        if (audioOutputDetection) {
            audioOutputDetection.style.display = 'block';
            audioOutputDetection.style.opacity = '0';
            audioOutputDetection.style.transform = 'translateY(10px)';
            setTimeout(() => {
                audioOutputDetection.style.opacity = '1';
                audioOutputDetection.style.transform = 'translateY(0)';
            }, 10);
            updateAudioOutputDetectionDisplay();
        }

        isDetecting = true;
        if (startBtn) startBtn.style.display = 'none';
        if (stopBtn) stopBtn.style.display = 'inline-block';
        if (speakBtn) speakBtn.disabled = false;

        // Start detection loop
        detectSign();
    } catch (error) {
        console.error('Error accessing camera:', error);
        if (outputText) {
            outputText.textContent = 'Error: Could not access camera. Please allow camera permissions.';
        }
        if (outputContainer) {
            outputContainer.style.display = 'block';
        }
        alert('Could not access camera. Please check your permissions and try again.');
    }
}

// Stop Detection
function stopDetection() {
    const video = document.getElementById('video');
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const cameraFrame = document.getElementById('cameraFrame');
    const cameraPlaceholder = cameraFrame ? cameraFrame.querySelector('.camera-placeholder') : null;
    const outputContainer = document.getElementById('outputContainer');
    const outputText = document.getElementById('outputText');
    const speakBtn = document.getElementById('speakBtn');

    isDetecting = false;

    // Clear detection interval
    if (detectionInterval) {
        clearInterval(detectionInterval);
        detectionInterval = null;
    }

    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }

    if (video) video.style.display = 'none';
    if (cameraPlaceholder) cameraPlaceholder.style.display = 'flex';
    
    // Hide output container with fade-out
    if (outputContainer) {
        outputContainer.style.opacity = '0';
        setTimeout(() => {
            outputContainer.style.display = 'none';
        }, 300);
    }
    
    // Hide audio output detection
    const audioOutputDetection = document.getElementById('audioOutputDetection');
    if (audioOutputDetection) {
        audioOutputDetection.style.opacity = '0';
        setTimeout(() => {
            audioOutputDetection.style.display = 'none';
        }, 300);
    }

    if (startBtn) startBtn.style.display = 'inline-block';
    if (stopBtn) stopBtn.style.display = 'none';
    if (speakBtn) speakBtn.disabled = true;
    if (outputText) outputText.textContent = 'No detection yet...';
    currentDetection = '';
}

// Detection Loop (Simulated)
function detectSign() {
    if (!isDetecting) return;

    const outputText = document.getElementById('outputText');
    const signs = ['Hello', 'Thank You', 'Yes', 'No', 'Please', 'Sorry', 'Help', 'Water', 'Food', 'Good'];

    // Simulate detection every 2 seconds
    detectionInterval = setInterval(() => {
        if (!isDetecting) {
            clearInterval(detectionInterval);
            return;
        }

        const randomSign = signs[Math.floor(Math.random() * signs.length)];
        
        if (randomSign !== currentDetection && outputText) {
            currentDetection = randomSign;
            outputText.textContent = randomSign;
            
            // Add to detected signs history for audio output feature
            detectedSignsHistory.unshift(randomSign);
            if (detectedSignsHistory.length > 10) {
                detectedSignsHistory.pop();
            }
            updateAudioOutputDisplay();
            updateAudioOutputDetectionDisplay();
        }
    }, 2000);
}

// Text-to-Speech Function
function speak(text) {
    if ('speechSynthesis' in window) {
        const msg = new SpeechSynthesisUtterance(text);
        msg.lang = 'en-US';
        msg.rate = 1;
        msg.pitch = 1;
        msg.volume = 1;
        window.speechSynthesis.speak(msg);
    } else {
        alert('Text-to-speech is not supported in your browser.');
    }
}

// Speak Output Button
function speakOutput() {
    const outputText = document.getElementById('outputText');
    const text = outputText ? outputText.textContent : '';

    if (text && text !== 'No detection yet...') {
        speak(text);
    } else {
        alert('No sign detected yet. Please start detection first.');
    }
}

// ============================================
// ADD SIGN SECTION
// ============================================

let captureStream = null;
let capturedImageData = null;

// Select upload option (upload or capture)
function selectUploadOption(option) {
    const uploadOption = document.getElementById('uploadOption');
    const captureOption = document.getElementById('captureOption');
    const uploadArea = document.getElementById('uploadArea');
    const cameraCaptureArea = document.getElementById('cameraCaptureArea');
    
    if (option === 'upload') {
        uploadOption.classList.add('active');
        captureOption.classList.remove('active');
        uploadArea.style.display = 'block';
        cameraCaptureArea.style.display = 'none';
        
        // Stop capture stream if active
        if (captureStream) {
            captureStream.getTracks().forEach(track => track.stop());
            captureStream = null;
        }
    } else {
        uploadOption.classList.remove('active');
        captureOption.classList.add('active');
        uploadArea.style.display = 'none';
        cameraCaptureArea.style.display = 'block';
        
        // Initialize camera for capture
        initializeCaptureCamera();
    }
}

// Initialize camera for capture
async function initializeCaptureCamera() {
    const captureVideo = document.getElementById('captureVideo');
    const capturePlaceholder = document.getElementById('capturePlaceholder');
    const captureBtn = document.getElementById('captureBtn');
    
    try {
        captureStream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                width: { ideal: 1280 },
                height: { ideal: 720 },
                facingMode: 'user'
            } 
        });

        if (captureVideo) {
            captureVideo.srcObject = captureStream;
            captureVideo.style.display = 'block';
        }
        if (capturePlaceholder) {
            capturePlaceholder.style.display = 'none';
        }
        if (captureBtn) {
            captureBtn.style.display = 'flex';
        }
    } catch (error) {
        console.error('Error accessing camera:', error);
        alert('Could not access camera. Please check your permissions and try again.');
    }
}

// Capture sign from camera
function captureSign() {
    const captureVideo = document.getElementById('captureVideo');
    const captureCanvas = document.getElementById('captureCanvas');
    const imagePreview = document.getElementById('imagePreview');
    const previewImage = document.getElementById('previewImage');
    const uploadArea = document.getElementById('uploadArea');
    
    if (!captureVideo || !captureCanvas) return;
    
    // Set canvas dimensions to match video
    captureCanvas.width = captureVideo.videoWidth;
    captureCanvas.height = captureVideo.videoHeight;
    
    // Draw video frame to canvas
    const ctx = captureCanvas.getContext('2d');
    ctx.drawImage(captureVideo, 0, 0);
    
    // Convert canvas to image data
    capturedImageData = captureCanvas.toDataURL('image/png');
    
    // Show preview
    if (previewImage) {
        previewImage.src = capturedImageData;
    }
    if (imagePreview) {
        imagePreview.style.display = 'block';
    }
    if (uploadArea) {
        uploadArea.style.display = 'none';
    }
    
    // Stop camera stream
    if (captureStream) {
        captureStream.getTracks().forEach(track => track.stop());
        captureStream = null;
    }
    
    // Hide camera elements
    const capturePlaceholder = document.getElementById('capturePlaceholder');
    const captureBtn = document.getElementById('captureBtn');
    if (captureVideo) captureVideo.style.display = 'none';
    if (capturePlaceholder) capturePlaceholder.style.display = 'flex';
    if (captureBtn) captureBtn.style.display = 'none';
}

// Remove preview
function removePreview() {
    const imagePreview = document.getElementById('imagePreview');
    const uploadArea = document.getElementById('uploadArea');
    const uploadPlaceholder = document.getElementById('uploadPlaceholder');
    
    if (imagePreview) imagePreview.style.display = 'none';
    if (uploadArea) uploadArea.style.display = 'block';
    if (uploadPlaceholder) {
        uploadPlaceholder.innerHTML = `
            <span class="upload-icon">📤</span>
            <p>Click to upload image or video</p>
        `;
    }
    
    capturedImageData = null;
    
    // Reset file input
    const signFile = document.getElementById('signFile');
    if (signFile) signFile.value = '';
}

// Initialize upload handlers
function initializeUploadHandlers() {
    const uploadArea = document.getElementById('uploadArea');
    const signFile = document.getElementById('signFile');
    const uploadPlaceholder = document.getElementById('uploadPlaceholder');

    if (uploadArea && signFile && uploadPlaceholder) {
        uploadPlaceholder.addEventListener('click', () => {
            signFile.click();
        });

        signFile.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                // Show preview for images
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const imagePreview = document.getElementById('imagePreview');
                        const previewImage = document.getElementById('previewImage');
                        if (imagePreview && previewImage) {
                            previewImage.src = e.target.result;
                            imagePreview.style.display = 'block';
                            uploadArea.style.display = 'none';
                        }
                    };
                    reader.readAsDataURL(file);
                } else {
                    // For videos, just show file name
                    uploadPlaceholder.innerHTML = `
                        <span class="upload-icon">✅</span>
                        <p>File selected: ${file.name}</p>
                    `;
                }
            }
        });
    }
}

// Submit Sign with Verification
function submitSign() {
    const signMeaning = document.getElementById('signMeaning');
    const signFile = document.getElementById('signFile');
    const verificationMessage = document.getElementById('verificationMessage');
    const successMessage = document.getElementById('successMessage');
    
    // Hide previous messages
    if (verificationMessage) verificationMessage.style.display = 'none';
    if (successMessage) successMessage.style.display = 'none';
    
    if (!signMeaning || !signMeaning.value.trim()) {
        alert('Please enter the meaning of the sign');
        return;
    }

    let file = null;
    let imageData = null;
    
    // Check if using captured image or uploaded file
    if (capturedImageData) {
        imageData = capturedImageData;
        // Convert data URL to blob for size check
        const byteString = atob(imageData.split(',')[1]);
        const mimeString = imageData.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        file = new Blob([ab], { type: mimeString });
    } else if (signFile && signFile.files[0]) {
        file = signFile.files[0];
    } else {
        alert('Please upload or capture a sign');
        return;
    }

    // Verify sign quality
    if (file) {
        // Check file size (< 50 KB = poor quality)
        const fileSizeKB = file.size / 1024;
        
        // For images, also check resolution
        if (file.type.startsWith('image/') || imageData) {
            const img = new Image();
            img.onload = function() {
                const width = img.width;
                const height = img.height;
                const minDimension = Math.min(width, height);
                
                // Check quality: file size < 50KB OR resolution < 300px
                if (fileSizeKB < 50 || minDimension < 300) {
                    // Poor quality
                    if (verificationMessage) {
                        verificationMessage.className = 'verification-message error';
                        verificationMessage.innerHTML = '❌ Sign cannot be saved. Please upload a clearer sign.';
                        verificationMessage.style.display = 'flex';
                    }
                } else {
                    // Good quality
                    showSuccessMessage();
                }
            };
            
            if (imageData) {
                img.src = imageData;
            } else {
                const reader = new FileReader();
                reader.onload = function(e) {
                    img.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        } else {
            // For videos, only check file size
            if (fileSizeKB < 50) {
                if (verificationMessage) {
                    verificationMessage.className = 'verification-message error';
                    verificationMessage.innerHTML = '❌ Sign cannot be saved. Please upload a clearer sign.';
                    verificationMessage.style.display = 'flex';
                }
            } else {
                showSuccessMessage();
            }
        }
    }
}

function showSuccessMessage() {
    const successMessage = document.getElementById('successMessage');
    const verificationMessage = document.getElementById('verificationMessage');
    
    if (verificationMessage) verificationMessage.style.display = 'none';
    if (successMessage) {
        successMessage.style.display = 'flex';
        successMessage.innerHTML = `
            <span class="success-icon">✅</span>
            <p>Sign saved successfully. Pending review.</p>
        `;
        
        // Reset form
        const signMeaning = document.getElementById('signMeaning');
        const signFile = document.getElementById('signFile');
        if (signMeaning) signMeaning.value = '';
        if (signFile) signFile.value = '';
        removePreview();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            if (successMessage) successMessage.style.display = 'none';
        }, 5000);
    }
}

// ============================================
// CONTACT FORM
// ============================================

function handleContactSubmit(event) {
    event.preventDefault();
    
    const name = document.getElementById('contactName');
    const email = document.getElementById('contactEmail');
    const message = document.getElementById('contactMessage');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');
    const contactSuccess = document.getElementById('contactSuccess');
    const contactForm = document.getElementById('contactForm');
    
    // Clear previous errors
    if (nameError) nameError.textContent = '';
    if (emailError) emailError.textContent = '';
    if (messageError) messageError.textContent = '';
    
    let isValid = true;
    
    // Validate name
    if (!name || !name.value.trim()) {
        if (nameError) nameError.textContent = 'Name is required';
        isValid = false;
    }
    
    // Validate email
    if (!email || !email.value.trim()) {
        if (emailError) emailError.textContent = 'Email is required';
        isValid = false;
    } else if (!isValidEmail(email.value)) {
        if (emailError) emailError.textContent = 'Please enter a valid email address';
        isValid = false;
    }
    
    // Validate message
    if (!message || !message.value.trim()) {
        if (messageError) messageError.textContent = 'Message is required';
        isValid = false;
    }
    
    if (isValid) {
        // Simulate form submission
        console.log('Contact form submitted:', {
            name: name.value,
            email: email.value,
            message: message.value
        });
        
        // Show success message
        if (contactForm) contactForm.style.display = 'none';
        if (contactSuccess) contactSuccess.style.display = 'flex';
        
        // Reset form after 5 seconds
        setTimeout(() => {
            if (contactForm) {
                contactForm.style.display = 'block';
                contactForm.reset();
            }
            if (contactSuccess) contactSuccess.style.display = 'none';
        }, 5000);
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Update Audio Output Display (for features section)
function updateAudioOutputDisplay() {
    const audioOutputList = document.getElementById('audioOutputList');
    if (audioOutputList) {
        if (detectedSignsHistory.length > 0) {
            audioOutputList.textContent = detectedSignsHistory.join(', ');
        } else {
            audioOutputList.textContent = 'No detections yet';
        }
    }
    // Also update detection section display
    updateAudioOutputDetectionDisplay();
}

// Update Audio Output Display (for detection section)
function updateAudioOutputDetectionDisplay() {
    const audioOutputDetectionList = document.getElementById('audioOutputDetectionList');
    if (audioOutputDetectionList) {
        if (detectedSignsHistory.length > 0) {
            // Show recent detections (last 5) in reverse order (most recent first)
            const recentDetections = detectedSignsHistory.slice(0, 5);
            audioOutputDetectionList.textContent = recentDetections.join(', ');
        } else {
            audioOutputDetectionList.textContent = 'No detections yet';
        }
    }
}

// ============================================
// LOGIN STATUS & SIDEBAR
// ============================================

function checkLoginStatus() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const sidebar = document.getElementById('sidebar');
    const navAddSign = document.getElementById('navAddSign');

    if (isLoggedIn === 'true') {
        if (sidebar) sidebar.style.display = 'block';
        if (navAddSign) navAddSign.style.display = 'block';
        
        // Adjust main content margin for sidebar (desktop only)
        if (window.innerWidth > 768) {
            document.body.style.marginLeft = '250px';
        }
        
        // Mobile: convert sidebar to hamburger menu
        if (window.innerWidth <= 768) {
            document.body.style.marginLeft = '0';
            createMobileSidebarToggle();
        }
    } else {
        if (sidebar) sidebar.style.display = 'none';
        if (navAddSign) navAddSign.style.display = 'none';
        document.body.style.marginLeft = '0';
    }
    
    // Re-initialize navigation after login status check
    setTimeout(() => {
        initializeNavigation();
    }, 100);
}

// Mobile Sidebar Toggle
function createMobileSidebarToggle() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    let mobileMenuBtn = document.getElementById('mobileMenuBtn');
    if (!mobileMenuBtn) {
        mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.id = 'mobileMenuBtn';
        mobileMenuBtn.className = 'mobile-menu-btn';
        mobileMenuBtn.innerHTML = '☰';
        mobileMenuBtn.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 1001;
            background: var(--gradient-hero);
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 10px;
            font-size: 1.5rem;
            cursor: pointer;
            box-shadow: var(--shadow-lg);
        `;
        document.body.appendChild(mobileMenuBtn);

        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            document.body.classList.toggle('sidebar-open');
        });
    }
}

// Handle window resize for responsive sidebar
window.addEventListener('resize', () => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const sidebar = document.getElementById('sidebar');
    
    if (isLoggedIn === 'true' && sidebar) {
        if (window.innerWidth > 768) {
            sidebar.style.display = 'block';
            document.body.style.marginLeft = '250px';
        } else {
            document.body.style.marginLeft = '0';
            createMobileSidebarToggle();
        }
    }
});

// ============================================
// LOGIN HANDLER
// ============================================

function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email');
    const password = document.getElementById('password');

    if (email && password && email.value && password.value) {
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('userEmail', email.value);
        window.location.href = 'index.html';
    } else {
        alert('Please fill in all fields');
    }
}

// Logout functionality
function logout() {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('userEmail');
    window.location.href = 'index.html';
}

// ============================================
// CREATE ACCOUNT HANDLER
// ============================================

function handleCreateAccount(event) {
    event.preventDefault();
    
    const name = document.getElementById('createName');
    const email = document.getElementById('createEmail');
    const password = document.getElementById('createPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');
    
    // Clear previous errors
    if (nameError) nameError.textContent = '';
    if (emailError) emailError.textContent = '';
    if (passwordError) passwordError.textContent = '';
    if (confirmPasswordError) confirmPasswordError.textContent = '';
    
    let isValid = true;
    
    // Validate name
    if (!name || !name.value.trim()) {
        if (nameError) nameError.textContent = 'Name is required';
        isValid = false;
    } else if (name.value.trim().length < 2) {
        if (nameError) nameError.textContent = 'Name must be at least 2 characters';
        isValid = false;
    }
    
    // Validate email
    if (!email || !email.value.trim()) {
        if (emailError) emailError.textContent = 'Email is required';
        isValid = false;
    } else if (!isValidEmail(email.value)) {
        if (emailError) emailError.textContent = 'Please enter a valid email address';
        isValid = false;
    }
    
    // Validate password
    if (!password || !password.value) {
        if (passwordError) passwordError.textContent = 'Password is required';
        isValid = false;
    } else if (password.value.length < 6) {
        if (passwordError) passwordError.textContent = 'Password must be at least 6 characters';
        isValid = false;
    }
    
    // Validate confirm password
    if (!confirmPassword || !confirmPassword.value) {
        if (confirmPasswordError) confirmPasswordError.textContent = 'Please confirm your password';
        isValid = false;
    } else if (password && confirmPassword.value !== password.value) {
        if (confirmPasswordError) confirmPasswordError.textContent = 'Passwords do not match';
        isValid = false;
    }
    
    if (isValid) {
        // Simulate account creation
        console.log('Account created:', {
            name: name.value,
            email: email.value
        });
        
        // Set login status and redirect
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('userEmail', email.value);
        sessionStorage.setItem('userName', name.value);
        
        // Show success message briefly
        alert('Account created successfully! Redirecting...');
        
        // Redirect to home page
        window.location.href = 'index.html';
    }
}

// Add logout handler to logout link
document.addEventListener('DOMContentLoaded', () => {
    const logoutLink = document.querySelector('a[href="login.html"].sidebar-item');
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
});
