// Track all form errors
let form_errors = [];

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const errorOutput = document.getElementById('error-output');
    const infoOutput = document.getElementById('info-output');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const commentsInput = document.getElementById('comments');
    const charCounter = document.getElementById('char-counter');
    

    function updateCharCounter() {
        const maxLength = 20;
        const currentLength = commentsInput.value.length;
        const remaining = maxLength - currentLength;
        
        charCounter.textContent = `${remaining} characters remaining`;
        
        charCounter.classList.remove('warning', 'error');
        
        if (remaining < 15 && remaining >= 0) {
            charCounter.classList.add('warning');
        }
        
        if (remaining < 0) {
            charCounter.classList.add('error');
            charCounter.textContent = `${Math.abs(remaining)} characters over limit!`;
            showError('You have exceeded the character limit!', true);
            logError('comments', 'too_long', `Exceeded max length by ${Math.abs(remaining)} characters`);
        }
    }
    
    commentsInput.addEventListener('input', updateCharCounter);
    
    nameInput.addEventListener('input', function(e) {
        const value = e.target.value;
        const pattern = /[^A-Za-z\s]/g;
        
        if (pattern.test(value)) {
            e.target.classList.add('field-error');
            setTimeout(() => e.target.classList.remove('field-error'), 500);
            
            showError('Only letters and spaces are allowed in the name field!');
            
            e.target.setCustomValidity('Only letters and spaces allowed');
            
            logError('name', 'invalid_character', 'Non-alphabetic character entered');
            
        } else {
            e.target.setCustomValidity('');
            clearError();
        }
    });
    
    function setupCustomValidation(input) {
        input.addEventListener('blur', function() {
            validateField(input);
        });
        
        input.addEventListener('input', function() {
            input.setCustomValidity('');
            
            if (input.checkValidity()) {
                clearError();
            }
        });
    }
    
    function validateField(input) {
        const fieldName = input.name || input.id;
        
        if (!input.checkValidity()) {
            let message = '';
            
            if (input.validity.valueMissing) {
                message = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
                input.setCustomValidity(message);
                logError(fieldName, 'required', 'Field left empty');
            } 
            else if (input.validity.typeMismatch) {
                message = input.dataset.errorMessage || 'Please enter a valid value';
                input.setCustomValidity(message);
                logError(fieldName, 'type_mismatch', 'Invalid format');
            } 
            else if (input.validity.patternMismatch) {
                message = input.dataset.errorMessage || 'Invalid format';
                input.setCustomValidity(message);
                logError(fieldName, 'pattern_mismatch', 'Pattern does not match');
            } 
            else if (input.validity.tooShort) {
                message = `Minimum ${input.minLength} characters required`;
                input.setCustomValidity(message);
                logError(fieldName, 'too_short', `Less than ${input.minLength} characters`);
            } 
            else if (input.validity.tooLong) {
                message = `Maximum ${input.maxLength} characters allowed`;
                input.setCustomValidity(message);
                logError(fieldName, 'too_long', `More than ${input.maxLength} characters`);
            }
            
            showError(message);
            return false;
        }
        
        input.setCustomValidity('');
        return true;
    }
    
    [nameInput, emailInput, commentsInput].forEach(setupCustomValidation);
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        [nameInput, emailInput, commentsInput].forEach(input => {
            input.setCustomValidity('');
        });
        
        let isValid = true;
        [nameInput, emailInput, commentsInput].forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        if (!isValid || !form.checkValidity()) {
            showError('Please fix all errors before submitting');
            
            const firstInvalidField = form.querySelector(':invalid');
            if (firstInvalidField) {
                firstInvalidField.focus();
            }
            return;
        }
        
        document.querySelector('input[name="possible_bot"]').value = 'false';
        
        document.getElementById('form-errors-field').value = JSON.stringify(form_errors);
        
        showInfo('Form validation passed! Submitting...');
        
        setTimeout(() => {
            form.submit();
        }, 5000);
    });
    
    function showError(message, autoHide = false) {
        errorOutput.textContent = message;
        errorOutput.style.display = 'block';
        errorOutput.classList.remove('fade-out');
        
        if (autoHide) {
            setTimeout(() => {
                errorOutput.classList.add('fade-out');
                setTimeout(() => {
                    errorOutput.textContent = '';
                    errorOutput.style.display = 'none';
                    errorOutput.classList.remove('fade-out');
                }, 2000);
            }, 1000);
        }
    }
    
    function clearError() {
        errorOutput.textContent = '';
        errorOutput.style.display = 'none';
        errorOutput.classList.remove('fade-out');
    }
    
    function showInfo(message) {
        infoOutput.textContent = message;
        infoOutput.style.display = 'block';
        infoOutput.classList.remove('fade-out');
    }
    
    function logError(field, errorType, description) {
        form_errors.push({
            field: field,
            error_type: errorType,
            description: description,
            timestamp: new Date().toISOString()
        });
        
        console.log('Error logged:', form_errors[form_errors.length - 1]);
    }
    
    updateCharCounter();
});