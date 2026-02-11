// Authentication System - Email with 2FA Support
class AuthSystem {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.currentForm = 'login';
    }

    init() {
        // Initialize the authentication system
        console.log('AuthSystem initialized');
        this.showTransition('Welcome back! Preparing your learning environment...', 2000);
        
        // Hide transition after delay
        setTimeout(() => {
            this.hideTransition();
        }, 2000);
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginFormElement');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Register form
        const registerForm = document.getElementById('registerFormElement');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        // 2FA form
        const twoFAForm = document.getElementById('twoFAFormElement');
        if (twoFAForm) {
            twoFAForm.addEventListener('submit', (e) => this.handle2FA(e));
        }

        // Form switchers
        const switchToRegister = document.getElementById('switchToRegister');
        if (switchToRegister) {
            switchToRegister.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchForm('register');
            });
        }

        const switchToLogin = document.getElementById('switchToLogin');
        if (switchToLogin) {
            switchToLogin.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchForm('login');
            });
        }

        // Resend code button
        const resendCodeBtn = document.getElementById('resendCode');
        if (resendCodeBtn) {
            resendCodeBtn.addEventListener('click', (e) => this.resendVerificationCode(e));
        }

        // Back to login from 2FA
        const backToLoginBtn = document.getElementById('backToLogin');
        if (backToLoginBtn) {
            backToLoginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchForm('login');
            });
        }

        // Real-time validation
        this.setupRealTimeValidation();

        // Auto-focus on verification code inputs
        this.setup2FAInputs();
    }

    setupRealTimeValidation() {
        // Email validation
        const emailInputs = document.querySelectorAll('input[type="email"]');
        emailInputs.forEach(input => {
            input.addEventListener('input', () => this.validateEmail(input));
            input.addEventListener('blur', () => this.validateEmail(input));
        });

        // Password validation
        const passwordInputs = document.querySelectorAll('input[type="password"]');
        passwordInputs.forEach(input => {
            if (input.id.includes('register')) {
                input.addEventListener('input', () => this.validatePassword(input));
            }
        });

        // Confirm password validation
        const confirmPasswordInput = document.getElementById('confirmPassword');
        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', () => this.validateConfirmPassword(confirmPasswordInput));
        }
    }

    setup2FAInputs() {
        const codeInputs = document.querySelectorAll('.code-input');
        codeInputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                // Move to next input if digit entered
                if (e.target.value.length === 1 && index < codeInputs.length - 1) {
                    codeInputs[index + 1].focus();
                }
            });

            input.addEventListener('keydown', (e) => {
                // Move to previous input on backspace
                if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
                    codeInputs[index - 1].focus();
                }
            });

            input.addEventListener('paste', (e) => {
                e.preventDefault();
                const pastedData = e.clipboardData.getData('text');
                const digits = pastedData.replace(/\D/g, '').slice(0, 6);
                
                digits.split('').forEach((digit, i) => {
                    if (codeInputs[i]) {
                        codeInputs[i].value = digit;
                    }
                });
                
                // Focus on last filled input or submit if all filled
                const lastIndex = Math.min(digits.length - 1, codeInputs.length - 1);
                if (lastIndex >= 0) {
                    codeInputs[lastIndex].focus();
                }
                
                if (digits.length === 6) {
                    this.submitVerificationCode();
                }
            });
        });
    }

    validateEmail(input) {
        const email = input.value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(email);
        
        this.updateFieldValidation(input, isValid, isValid ? '' : 'Please enter a valid email address');
        return isValid;
    }

    validatePassword(input) {
        const password = input.value;
        const minLength = password.length >= 8;
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        const isValid = minLength && hasUpper && hasLower && hasNumber && hasSpecial;
        let message = '';
        
        if (!isValid) {
            const missing = [];
            if (!minLength) missing.push('8+ characters');
            if (!hasUpper) missing.push('uppercase letter');
            if (!hasLower) missing.push('lowercase letter');
            if (!hasNumber) missing.push('number');
            if (!hasSpecial) missing.push('special character');
            message = `Password needs: ${missing.join(', ')}`;
        }
        
        this.updateFieldValidation(input, isValid, message);
        return isValid;
    }

    validateConfirmPassword(input) {
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = input.value;
        const isValid = password === confirmPassword;
        
        this.updateFieldValidation(input, isValid, isValid ? '' : 'Passwords do not match');
        return isValid;
    }

    updateFieldValidation(input, isValid, message) {
        const formGroup = input.closest('.form-floating');
        const feedback = formGroup.querySelector('.invalid-feedback');
        
        if (isValid) {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
        } else {
            input.classList.remove('is-valid');
            input.classList.add('is-invalid');
            if (feedback) {
                feedback.textContent = message;
            }
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        if (!this.validateEmail(document.getElementById('loginEmail'))) {
            return;
        }
        
        const submitBtn = e.target.querySelector('.btn-primary-custom');
        this.setButtonLoading(submitBtn, true, 'Signing in...');
        
        try {
            // Simulate API call
            await this.simulateAPICall(1500);
            
            // For demo purposes, always proceed to 2FA
            this.userEmail = email;
            await this.sendVerificationCode(email);
            this.switchForm('2fa');
            this.showAlert('success', `Verification code sent to ${email}`);
            
        } catch (error) {
            this.showAlert('error', 'Login failed. Please check your credentials.');
        } finally {
            this.setButtonLoading(submitBtn, false, 'Sign In');
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Validate all fields
        const emailValid = this.validateEmail(document.getElementById('registerEmail'));
        const passwordValid = this.validatePassword(document.getElementById('registerPassword'));
        const confirmValid = this.validateConfirmPassword(document.getElementById('confirmPassword'));
        
        if (!emailValid || !passwordValid || !confirmValid) {
            return;
        }
        
        const submitBtn = e.target.querySelector('.btn-primary-custom');
        this.setButtonLoading(submitBtn, true, 'Creating account...');
        
        try {
            // Simulate API call
            await this.simulateAPICall(2000);
            
            // For demo purposes, always proceed to 2FA
            this.userEmail = email;
            await this.sendVerificationCode(email);
            this.switchForm('2fa');
            this.showAlert('success', `Account created! Verification code sent to ${email}`);
            
        } catch (error) {
            this.showAlert('error', 'Registration failed. Please try again.');
        } finally {
            this.setButtonLoading(submitBtn, false, 'Create Account');
        }
    }

    async handle2FA(e) {
        e.preventDefault();
        
        const code = this.getVerificationCode();
        
        if (code.length !== 6) {
            this.showAlert('error', 'Please enter a 6-digit verification code');
            return;
        }
        
        const submitBtn = e.target.querySelector('.btn-primary-custom');
        this.setButtonLoading(submitBtn, true, 'Verifying...');
        
        try {
            // Simulate API call
            await this.simulateAPICall(1500);
            
            // For demo purposes, accept any 6-digit code
            if (code === '123456' || code.length === 6) {
                this.showAlert('success', 'Verification successful! Redirecting to dashboard...');
                
                setTimeout(() => {
                    this.redirectToDashboard();
                }, 1500);
            } else {
                throw new Error('Invalid code');
            }
            
        } catch (error) {
            this.showAlert('error', 'Invalid verification code. Please try again.');
            this.clearVerificationCode();
        } finally {
            this.setButtonLoading(submitBtn, false, 'Verify & Continue');
        }
    }

    getVerificationCode() {
        const inputs = document.querySelectorAll('.code-input');
        return Array.from(inputs).map(input => input.value).join('');
    }

    clearVerificationCode() {
        const inputs = document.querySelectorAll('.code-input');
        inputs.forEach(input => {
            input.value = '';
        });
        if (inputs.length > 0) {
            inputs[0].focus();
        }
    }

    submitVerificationCode() {
        const form = document.getElementById('twoFAFormElement');
        if (form) {
            form.dispatchEvent(new Event('submit'));
        }
    }

    async sendVerificationCode(email) {
        // Simulate sending verification code via email
        console.log(`Sending verification code to ${email}`);
        await this.simulateAPICall(800);
        return true;
    }

    async resendVerificationCode(e) {
        e.preventDefault();
        
        const btn = e.target;
        this.setButtonLoading(btn, true, 'Sending...');
        
        try {
            await this.sendVerificationCode(this.userEmail);
            this.showAlert('success', 'Verification code resent successfully');
        } catch (error) {
            this.showAlert('error', 'Failed to resend code. Please try again.');
        } finally {
            this.setButtonLoading(btn, false, 'Resend Code');
        }
    }

    switchForm(formName) {
        const forms = document.querySelectorAll('.auth-form');
        
        // Hide all forms
        forms.forEach(form => {
            form.style.display = 'none';
        });
        
        // Show target form
        const targetForm = document.getElementById(`${formName}Form`);
        if (targetForm) {
            targetForm.style.display = 'block';
            
            // Focus first input
            const firstInput = targetForm.querySelector('input');
            if (firstInput) {
                firstInput.focus();
            }
            
            // Update form indicator
            this.updateFormIndicator(formName);
        }
        
        this.currentForm = formName;
    }

    updateFormIndicator(formName) {
        const indicators = document.querySelectorAll('.form-indicator');
        indicators.forEach(indicator => {
            indicator.classList.remove('active');
        });
        
        const activeIndicator = document.querySelector(`.form-indicator[data-form="${formName}"]`);
        if (activeIndicator) {
            activeIndicator.classList.add('active');
        }
    }

    setButtonLoading(button, isLoading, text) {
        if (isLoading) {
            button.innerHTML = `
                <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                ${text}
            `;
            button.disabled = true;
        } else {
            button.innerHTML = text;
            button.disabled = false;
        }
    }

    showAlert(type, message) {
        // Remove existing alerts
        const existingAlerts = document.querySelectorAll('.alert');
        existingAlerts.forEach(alert => alert.remove());
        
        const alertClass = type === 'success' ? 'alert-success' : 'alert-danger';
        const iconClass = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-triangle';
        
        const alertHTML = `
            <div class="alert ${alertClass} alert-dismissible fade show" role="alert" style="
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                min-width: 300px;
                max-width: 500px;
                background: var(--glass-bg);
                backdrop-filter: blur(20px);
                border: 1px solid ${type === 'success' ? 'var(--success-color)' : 'var(--error-color)'};
                border-radius: 12px;
                box-shadow: var(--shadow-lg);
                animation: slideInFromRight 0.3s ease;
            ">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <i class="${iconClass}" style="font-size: 1.2rem; color: ${type === 'success' ? 'var(--success-color)' : 'var(--error-color)'};"></i>
                    <span style="flex: 1; color: var(--text-primary);">${message}</span>
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" style="filter: invert(1);"></button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', alertHTML);
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            const alert = document.querySelector('.alert');
            if (alert) {
                alert.remove();
            }
        }, 5000);
    }

    showTransition(message, duration = 2000) {
        const overlay = document.getElementById('transitionOverlay');
        const messageElement = document.getElementById('transitionMessage');
        
        if (overlay && messageElement) {
            messageElement.textContent = message;
            overlay.classList.remove('hidden');
        }
    }

    hideTransition() {
        const overlay = document.getElementById('transitionOverlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
    }

    async redirectToDashboard() {
        this.showTransition('Welcome! Loading your learning dashboard...', 3000);
        
        // Simulate dashboard preparation
        await this.simulateAPICall(2000);
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    }

    // Utility function to simulate API calls
    simulateAPICall(duration) {
        return new Promise((resolve) => {
            setTimeout(resolve, duration);
        });
    }
}

// Email Service Simulation
class EmailService {
    static async sendVerificationCode(email, code) {
        console.log(`📧 Sending verification code ${code} to ${email}`);
        
        // Simulate email sending delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // For demo purposes, always succeed
        return {
            success: true,
            messageId: Math.random().toString(36).substr(2, 9)
        };
    }
    
    static async sendWelcomeEmail(email, name) {
        console.log(`📧 Sending welcome email to ${email}`);
        
        // Simulate email sending delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return {
            success: true,
            messageId: Math.random().toString(36).substr(2, 9)
        };
    }
    
    static async sendPasswordResetEmail(email) {
        console.log(`📧 Sending password reset email to ${email}`);
        
        // Simulate email sending delay
        await new Promise(resolve => setTimeout(resolve, 600));
        
        return {
            success: true,
            messageId: Math.random().toString(36).substr(2, 9)
        };
    }
}

// User Session Management
class SessionManager {
    constructor() {
        this.sessionKey = 'learning_session';
        this.tokenKey = 'auth_token';
    }
    
    createSession(userData) {
        const sessionData = {
            user: userData,
            loginTime: Date.now(),
            expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
            sessionId: this.generateSessionId()
        };
        
        localStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
        localStorage.setItem(this.tokenKey, this.generateToken());
        
        return sessionData;
    }
    
    getSession() {
        const sessionData = localStorage.getItem(this.sessionKey);
        if (!sessionData) return null;
        
        const session = JSON.parse(sessionData);
        
        // Check if session expired
        if (Date.now() > session.expiresAt) {
            this.clearSession();
            return null;
        }
        
        return session;
    }
    
    clearSession() {
        localStorage.removeItem(this.sessionKey);
        localStorage.removeItem(this.tokenKey);
    }
    
    isAuthenticated() {
        const session = this.getSession();
        return session !== null;
    }
    
    generateSessionId() {
        return Math.random().toString(36).substr(2, 16) + Date.now().toString(36);
    }
    
    generateToken() {
        return 'token_' + Math.random().toString(36).substr(2, 32);
    }
}

// CSS Animation keyframes
const style = document.createElement('style');
style.textContent = `
@keyframes slideInFromRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes pulse {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.5;
    }
}

.spinner-border-sm {
    width: 1rem;
    height: 1rem;
    animation: pulse 1s ease-in-out infinite;
}
`;
document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.authSystem = new AuthSystem();
    window.sessionManager = new SessionManager();
    window.emailService = EmailService;
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AuthSystem, EmailService, SessionManager };
}
