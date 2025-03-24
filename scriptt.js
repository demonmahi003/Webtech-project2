document.addEventListener("DOMContentLoaded", () => {
    // Form and Modal elements
    const registerBtn = document.getElementById("register-btn");
    const loginBtn = document.getElementById("login-btn");
    const userForm = document.getElementById("user-form");
    const modal = document.getElementById("loginModal");
    const closeBtn = document.querySelector(".close");
    const loginForm = document.getElementById("loginForm");

    // Validation patterns
    const validationRules = {
        email: {
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Please enter a valid email address"
        },
        password: {
            pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
            message: "Password must be at least 8 characters long and contain both letters and numbers"
        },
        date: {
            validate: (value) => {
                const selectedDate = new Date(value);
                const today = new Date();
                return selectedDate >= today;
            },
            message: "Please select a future date"
        }
    };

    // Error display functions
    const showError = (input, message) => {
        const formGroup = input.closest('.form-group');
        const existingError = formGroup.querySelector('.error-message');
        
        if (!existingError) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = message;
            formGroup.appendChild(errorDiv);
        }
        input.classList.add('error');
    };

    const removeError = (input) => {
        const formGroup = input.closest('.form-group');
        const errorDiv = formGroup.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.remove();
        }
        input.classList.remove('error');
    };

    // Form validation
    const validateInput = (input) => {
        const value = input.value.trim();
        const type = input.type;
        const required = input.hasAttribute('required');

        if (required && !value) {
            showError(input, 'This field is required');
            return false;
        }

        if (value) {
            if (type === 'email' && !validationRules.email.pattern.test(value)) {
                showError(input, validationRules.email.message);
                return false;
            }

            if (type === 'password' && !validationRules.password.pattern.test(value)) {
                showError(input, validationRules.password.message);
                return false;
            }

            if (type === 'date' && !validationRules.date.validate(value)) {
                showError(input, validationRules.date.message);
                return false;
            }
        }

        removeError(input);
        return true;
    };

    // Real-time validation
    document.querySelectorAll('input, select').forEach(input => {
        // Validate on blur
        input.addEventListener('blur', () => {
            validateInput(input);
        });

        // Remove error on focus
        input.addEventListener('focus', () => {
            input.classList.add('focused');
            removeError(input);
        });

        // Remove focused class on blur
        input.addEventListener('blur', () => {
            input.classList.remove('focused');
        });

        // For select elements
        if (input.tagName === 'SELECT') {
            input.addEventListener('change', () => {
                validateInput(input);
            });
        }
    });

    // Form submission handling
    const handleFormSubmit = async (form, event) => {
        event.preventDefault();
        
        let isValid = true;
        const formData = new FormData(form);
        const formEntries = {};

        // Validate all inputs
        form.querySelectorAll('input, select').forEach(input => {
            if (!validateInput(input)) {
                isValid = false;
            }
            formEntries[input.name] = formData.get(input.name);
        });

        if (!isValid) {
            return false;
        }

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Success handling
            if (form.id === 'user-form') {
                showNotification('Account created successfully!', 'success');
                form.reset();
            } else {
                showNotification('Booking confirmed!', 'success');
                form.reset();
            }
        } catch (error) {
            showNotification('An error occurred. Please try again.', 'error');
        }
    };

    // Notification system
    const showNotification = (message, type) => {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    };

    // Event listeners for forms
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (event) => handleFormSubmit(form, event));
    });

    // Open modal
    loginBtn.addEventListener("click", () => {
        modal.style.display = "block";
        document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
    });

    // Close modal
    const closeModal = () => {
        modal.style.display = "none";
        document.body.style.overflow = ""; // Restore scrolling
        loginForm.reset(); // Clear form fields
    };

    // Close modal with X button
    closeBtn.addEventListener("click", closeModal);

    // Close modal when clicking outside
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Close modal when pressing Escape key
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && modal.style.display === "block") {
            closeModal();
        }
    });

    // Handle login form submission
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        
        let isValid = true;
        const formData = new FormData(loginForm);
        const formEntries = {};

        // Validate all inputs
        loginForm.querySelectorAll('input').forEach(input => {
            if (!validateInput(input)) {
                isValid = false;
            }
            formEntries[input.name] = formData.get(input.name);
        });

        if (!isValid) {
            return false;
        }

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            showNotification('Login successful!', 'success');
            closeModal();
            loginForm.reset();
        } catch (error) {
            showNotification('Login failed. Please try again.', 'error');
        }
    });

    // Add CSS for notifications
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 8px;
            color: white;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        }
        
        .notification.success {
            background-color: #2ecc71;
        }
        
        .notification.error {
            background-color: #e74c3c;
        }
        
        .error-message {
            color: #e74c3c;
            font-size: 0.85rem;
            margin-top: 0.5rem;
        }
        
        .fade-out {
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
        }
    `;
    document.head.appendChild(style);
});