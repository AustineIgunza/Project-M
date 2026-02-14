// Profile Page JavaScript

// Sample user data (in production, this would come from an API)
const userData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    bio: 'Passionate learner dedicated to mastering mathematics and physics. Always seeking new challenges and opportunities to grow.',
    location: 'San Francisco, USA',
    interests: 'Mathematics, Physics, Programming',
    memberSince: 'January 15, 2024',
    avatar: 'https://via.placeholder.com/150x150/1e3a8a/ffffff?text=JD',
    stats: {
        totalXP: 2450,
        currentLevel: 3,
        conceptsMastered: 24,
        streakDays: 7,
        coursesCompleted: 8,
        hoursLearned: 156.5,
        problemsSolved: 342,
        averageAccuracy: 87
    },
    achievements: [
        { id: 1, name: 'Streak Master', icon: 'fa-fire', locked: false },
        { id: 2, name: 'Problem Solver', icon: 'fa-lightbulb', locked: false },
        { id: 3, name: 'Quick Learner', icon: 'fa-rocket', locked: false },
        { id: 4, name: 'Accuracy Master', icon: 'fa-bullseye', locked: false },
        { id: 5, name: 'Expert', icon: 'fa-crown', locked: true },
        { id: 6, name: 'Legend', icon: 'fa-crown', locked: true }
    ]
};

// Initialize profile on page load
document.addEventListener('DOMContentLoaded', function() {
    loadUserProfile();
    setupEventListeners();
});

/**
 * Load user profile data into the page
 */
function loadUserProfile() {
    // Header information
    document.getElementById('profileName').textContent = `${userData.firstName} ${userData.lastName}`;
    document.getElementById('profileEmail').textContent = userData.email;
    document.getElementById('memberSince').textContent = `Member since ${userData.memberSince}`;
    document.getElementById('userName').textContent = userData.firstName;
    
    // Stats
    document.getElementById('totalXP').textContent = userData.stats.totalXP.toLocaleString();
    document.getElementById('currentLevel').textContent = userData.stats.currentLevel;
    document.getElementById('conceptsMastered').textContent = userData.stats.conceptsMastered;
    document.getElementById('streakDays').textContent = userData.stats.streakDays;
    
    // About section
    document.getElementById('userBio').textContent = userData.bio;
    document.getElementById('userLocation').textContent = userData.location;
    document.getElementById('userInterests').textContent = userData.interests;
    document.getElementById('memberSinceDetail').textContent = userData.memberSince;
    
    // Statistics cards
    document.getElementById('coursesCompleted').textContent = userData.stats.coursesCompleted;
    document.getElementById('hoursLearned').textContent = userData.stats.hoursLearned;
    document.getElementById('problemsSolved').textContent = userData.stats.problemsSolved;
    document.getElementById('averageAccuracy').textContent = userData.stats.averageAccuracy + '%';
    
    // Level information
    document.getElementById('levelNumber').textContent = userData.stats.currentLevel;
    const xpToNextLevel = 2500;
    const currentXP = userData.stats.totalXP % xpToNextLevel;
    document.getElementById('levelXP').textContent = `${currentXP.toLocaleString()} / ${xpToNextLevel.toLocaleString()} XP`;
    
    // Populate edit form with current data
    document.getElementById('editFirstName').value = userData.firstName;
    document.getElementById('editLastName').value = userData.lastName;
    document.getElementById('editEmail').value = userData.email;
    document.getElementById('editBio').value = userData.bio;
    document.getElementById('editLocation').value = userData.location;
    document.getElementById('editInterests').value = userData.interests;
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Close modals when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-overlay')) {
            e.target.closest('.edit-profile-modal, .modal-dialog').classList.add('hidden');
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.edit-profile-modal, .modal-dialog').forEach(modal => {
                modal.classList.add('hidden');
            });
        }
    });
}

/**
 * Toggle edit profile mode
 */
function toggleEditMode() {
    const modal = document.getElementById('editProfileModal');
    modal.classList.toggle('hidden');
    
    if (!modal.classList.contains('hidden')) {
        // Focus first input when modal opens
        setTimeout(() => {
            document.getElementById('editFirstName').focus();
        }, 100);
    }
}

/**
 * Save profile changes
 */
function saveProfileChanges(event) {
    event.preventDefault();
    
    // Get form values
    const firstName = document.getElementById('editFirstName').value;
    const lastName = document.getElementById('editLastName').value;
    const email = document.getElementById('editEmail').value;
    const bio = document.getElementById('editBio').value;
    const location = document.getElementById('editLocation').value;
    const interests = document.getElementById('editInterests').value;
    
    // Validate inputs
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Update user data
    userData.firstName = firstName;
    userData.lastName = lastName;
    userData.email = email;
    userData.bio = bio;
    userData.location = location;
    userData.interests = interests;
    
    // In production, send to API
    console.log('Saving profile changes:', userData);
    
    // Update UI
    loadUserProfile();
    toggleEditMode();
    
    showNotification('Profile updated successfully!', 'success');
}

/**
 * Trigger avatar upload
 */
function triggerAvatarUpload() {
    document.getElementById('avatarInput').click();
}

/**
 * Handle avatar upload
 */
function handleAvatarUpload(event) {
    const file = event.target.files[0];
    
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showNotification('Please select an image file', 'error');
        return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showNotification('File size must be less than 5MB', 'error');
        return;
    }
    
    // Create file reader
    const reader = new FileReader();
    
    reader.onload = function(e) {
        // Update avatar image
        document.getElementById('profileAvatar').src = e.target.result;
        userData.avatar = e.target.result;
        
        // In production, upload to server
        console.log('Avatar updated');
        showNotification('Profile picture updated successfully!', 'success');
    };
    
    reader.onerror = function() {
        showNotification('Error reading file', 'error');
    };
    
    reader.readAsDataURL(file);
}

/**
 * Open change password modal
 */
function openChangePassword(event) {
    event.preventDefault();
    document.getElementById('changePasswordModal').classList.remove('hidden');
    setTimeout(() => {
        document.getElementById('currentPassword').focus();
    }, 100);
}

/**
 * Handle change password
 */
function handleChangePassword(event) {
    event.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validate inputs
    if (!currentPassword || !newPassword || !confirmPassword) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Validate password strength
    if (newPassword.length < 8) {
        showNotification('Password must be at least 8 characters long', 'error');
        return;
    }
    
    if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
        showNotification('Password must contain uppercase, lowercase, and numbers', 'error');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    // In production, send to API
    console.log('Changing password');
    
    closeModal('changePasswordModal');
    showNotification('Password changed successfully!', 'success');
}

/**
 * Open notification settings
 */
function openNotificationSettings(event) {
    event.preventDefault();
    showNotification('Notification settings coming soon!', 'info');
}

/**
 * Open privacy settings
 */
function openPrivacySettings(event) {
    event.preventDefault();
    showNotification('Privacy settings coming soon!', 'info');
}

/**
 * Open data export
 */
function openDataExport(event) {
    event.preventDefault();
    
    // Create data export
    const exportData = {
        user: userData,
        exportDate: new Date().toISOString(),
        version: '1.0'
    };
    
    // Convert to JSON and download
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `learnforge-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    showNotification('Data exported successfully!', 'success');
}

/**
 * Open delete account confirmation
 */
function openDeleteAccount(event) {
    event.preventDefault();
    
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        if (confirm('This will permanently delete all your data. Are you absolutely sure?')) {
            // In production, send to API
            console.log('Deleting account');
            showNotification('Account deleted. Redirecting...', 'success');
            
            // Redirect to login after 2 seconds
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        }
    }
}

/**
 * Close modal
 */
function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

/**
 * Show notification toast
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles if not already present
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                background: var(--glass-bg);
                border: 1px solid var(--glass-border);
                border-radius: 12px;
                padding: 1rem 1.5rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1rem;
                backdrop-filter: blur(20px);
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                animation: slideInRight 0.3s ease;
                z-index: 10000;
                max-width: 400px;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                color: var(--text-primary);
                font-weight: 500;
            }
            
            .notification-success {
                border-color: var(--success-color);
            }
            
            .notification-success .notification-content i {
                color: var(--success-color);
            }
            
            .notification-error {
                border-color: var(--error-color);
            }
            
            .notification-error .notification-content i {
                color: var(--error-color);
            }
            
            .notification-info {
                border-color: var(--primary-light);
            }
            
            .notification-info .notification-content i {
                color: var(--primary-light);
            }
            
            .notification-close {
                background: none;
                border: none;
                color: var(--text-secondary);
                cursor: pointer;
                font-size: 1rem;
                padding: 0;
                transition: color 0.3s ease;
            }
            
            .notification-close:hover {
                color: var(--text-primary);
            }
            
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(100px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            @media (max-width: 768px) {
                .notification {
                    bottom: 1rem;
                    right: 1rem;
                    left: 1rem;
                    max-width: none;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

/**
 * Get notification icon based on type
 */
function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

/**
 * Logout user
 */
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        // In production, clear session/token
        console.log('Logging out');
        window.location.href = 'login.html';
    }
}

/**
 * Format large numbers with commas
 */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Calculate level progress percentage
 */
function calculateLevelProgress() {
    const xpToNextLevel = 2500;
    const currentXP = userData.stats.totalXP % xpToNextLevel;
    return Math.round((currentXP / xpToNextLevel) * 100);
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadUserProfile,
        toggleEditMode,
        saveProfileChanges,
        handleAvatarUpload,
        showNotification,
        logout
    };
}
