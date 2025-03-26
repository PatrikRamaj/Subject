document.addEventListener('DOMContentLoaded', () => {
    // Time Selection Elements
    const timeDropdown = document.getElementById('timeDropdown');
    const continueBtn = document.getElementById('continueBtn');
    const timeSelectionPage = document.getElementById('timeSelectionPage');
    
    // Personal Details Elements
    const personalDetailsPage = document.getElementById('personalDetailsPage');
    const reviewPage = document.getElementById('reviewPage');
    const form = document.getElementById('personalDetailsForm');
    const submitBtn = document.getElementById('submitBtn');
    const inputs = form.querySelectorAll('input[required]:not(#consentCheckbox)');
    const consentCheckbox = document.getElementById('consentCheckbox');

    // Time Selection Validation
    timeDropdown.addEventListener('change', () => {
        continueBtn.disabled = timeDropdown.value === '';
    });

    continueBtn.addEventListener('click', () => {
        if (!continueBtn.disabled) {
            localStorage.setItem('selectedTime', timeDropdown.value);
            
            timeSelectionPage.style.display = 'none';
            personalDetailsPage.style.display = 'block';
        }
    });

    // Validation functions
    const validations = {
        firstName: (value) => {
            const nameRegex = /^[A-Za-z\s-]{2,50}$/;
            return nameRegex.test(value.trim());
        },
        lastName: (value) => {
            const nameRegex = /^[A-Za-z\s-]{2,50}$/;
            return nameRegex.test(value.trim());
        },
        email: (value) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(value.trim());
        },
        phoneNumber: (value) => {
            const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
            return phoneRegex.test(value.trim());
        }
    };

    // Function to show error message
    function showError(input, message) {
        const existingError = input.nextElementSibling;
        if (existingError && existingError.classList.contains('error-message')) {
            existingError.remove();
        }

        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.style.color = 'red';
        errorElement.style.fontSize = '0.8em';
        errorElement.textContent = message;
        input.after(errorElement);

        input.style.borderColor = 'red';
    }

    function clearError(input) {
        const existingError = input.nextElementSibling;
        if (existingError && existingError.classList.contains('error-message')) {
            existingError.remove();
        }
        input.style.borderColor = '';
    }

    // Validate individual input
    function validateInput(input) {
        const value = input.value.trim();
        const inputId = input.id;

        if (value === '') {
            showError(input, 'This field cannot be empty');
            return false;
        }

        if (validations[inputId]) {
            if (!validations[inputId](value)) {
                switch(inputId) {
                    case 'firstName':
                    case 'lastName':
                        showError(input, 'Please enter a valid name (2-50 characters, letters only)');
                        return false;
                    case 'email':
                        showError(input, 'Please enter a valid email address');
                        return false;
                    case 'phoneNumber':
                        showError(input, 'Please enter a valid phone number');
                        return false;
                }
            }
        }

        clearError(input);
        return true;
    }

    // Function to check form validity
    function checkFormValidity() {
        const allValid = Array.from(inputs).every(validateInput);
        const consentChecked = consentCheckbox.checked;
        submitBtn.disabled = !(allValid && consentChecked);
    }

    inputs.forEach(input => {
        input.addEventListener('input', checkFormValidity);
        input.addEventListener('blur', () => validateInput(input));
    });

    consentCheckbox.addEventListener('change', checkFormValidity);

    // Form submission 
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const allValid = Array.from(inputs).every(validateInput);
        
        if (allValid && consentCheckbox.checked) {
            const formData = {
                selectedTime: localStorage.getItem('selectedTime'),
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                phoneNumber: document.getElementById('phoneNumber').value
            };

            document.getElementById('reviewTime').textContent = 
                document.querySelector(`#timeDropdown option[value="${formData.selectedTime}"]`).text;
            document.getElementById('reviewFirstName').textContent = formData.firstName;
            document.getElementById('reviewLastName').textContent = formData.lastName;
            document.getElementById('reviewEmail').textContent = formData.email;
            document.getElementById('reviewPhoneNumber').textContent = formData.phoneNumber;

            personalDetailsPage.style.display = 'none';
            reviewPage.style.display = 'block';
        }
    });
});