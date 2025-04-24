document.addEventListener('DOMContentLoaded', function() {
    // Form state management
    let formState = {
        currentStep: 1,
        claimType: null,
        formData: {},
        isDirty: false
    };

    // Cache DOM elements
    const claimTypeCards = document.querySelectorAll('.claim-type-card');
    const nextButton = document.querySelector('.next-step');
    const autoSaveIndicator = document.querySelector('.auto-save-indicator');
    const helpSidebar = document.querySelector('.help-sidebar');
    const closeHelpButton = document.querySelector('.close-help');
    const unsavedChangesModal = document.getElementById('unsavedChangesModal');
    const steps = document.querySelectorAll('.step');
    const formSteps = document.querySelectorAll('.form-step');

    // Incident type options for each claim type
    const incidentTypeOptions = {
        MOTOR: [
            'Accident',
            'Theft',
            'Fire Damage',
            'Natural Disaster',
            'Vandalism',
            'Mechanical Breakdown',
            'Third Party Damage'
        ],
        SME: [
            'Property Damage',
            'Business Interruption',
            'Equipment Breakdown',
            'Theft/Burglary',
            'Fire Incident',
            'Liability Claim',
            'Employee Injury'
        ],
        AGRO: [
            'Crop Damage',
            'Livestock Loss',
            'Equipment Failure',
            'Natural Disaster',
            'Disease Outbreak',
            'Storage Loss',
            'Transportation Loss'
        ],
        GADGET: [
            'Accidental Damage',
            'Liquid Damage',
            'Theft',
            'Screen Damage',
            'Hardware Failure',
            'Power Surge Damage',
            'Loss'
        ],
        HOUSEHOLDER: [
            'Fire Damage',
            'Burglary/Theft',
            'Water Damage',
            'Storm Damage',
            'Structural Damage',
            'Content Damage',
            'Natural Disaster'
        ]
    };

    // Get form elements
    const incidentTypeSelect = document.getElementById('incident-type');
    const basicInfoForm = document.querySelector('.basic-info-form');
    const nextStepBtn = basicInfoForm.querySelector('.next-step');
    const requiredFields = basicInfoForm.querySelectorAll('[required]');
    const incidentDescription = document.getElementById('incident-description');
    const characterCount = document.querySelector('.character-count');
    const incidentTimeInput = document.getElementById('incident-time');
    const incidentHourSelect = document.getElementById('incident-hour');
    const incidentMinuteSelect = document.getElementById('incident-minute');
    const incidentPeriodSelect = document.getElementById('incident-period');
    const claimTypeSelect = document.getElementById('claimType');
    const requirementsSections = document.querySelectorAll('.requirements-section');
    const acknowledgmentCheckbox = document.getElementById('acknowledgeRequirements');
    const submitButton = document.querySelector('button[type="submit"]');

    // Handle claim type selection
    claimTypeCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove selected class from all cards
            claimTypeCards.forEach(c => c.classList.remove('selected'));
            // Add selected class to clicked card
            card.classList.add('selected');
            
            // Get selected claim type
            const claimType = card.dataset.type;
            
            // Update form state
            formState.claimType = claimType;
            formState.isDirty = true;
            
            // Populate incident type dropdown immediately
            if (incidentTypeSelect) {
                populateIncidentTypes(claimType);
            }
            
            // Enable next step button in step 1
            document.querySelector('#step1 .next-step').removeAttribute('disabled');
            
            saveFormState();
        });
    });

    // Populate incident type dropdown based on claim type
    function populateIncidentTypes(claimType) {
        if (!incidentTypeSelect || !incidentTypeOptions[claimType]) {
            console.warn('Incident type select element not found or invalid claim type');
            return;
        }

        // Clear existing options except the first one
        while (incidentTypeSelect.options.length > 1) {
            incidentTypeSelect.remove(1);
        }
        
        // Add new options
        incidentTypeOptions[claimType].forEach(type => {
            const option = new Option(type, type.toLowerCase().replace(/\s+/g, '-'));
            incidentTypeSelect.add(option);
        });

        // Trigger change event to update validation
        incidentTypeSelect.dispatchEvent(new Event('change'));
    }

    // Character count for incident description
    incidentDescription.addEventListener('input', () => {
        const remaining = incidentDescription.maxLength - incidentDescription.value.length;
        characterCount.textContent = `${incidentDescription.value.length}/${incidentDescription.maxLength}`;
    });

    // Handle time input
    if (incidentTimeInput) {
        incidentTimeInput.addEventListener('change', function() {
            if (this.value) {
                // Convert 24h to 12h format for display
                const [hours, minutes] = this.value.split(':');
                const hour = parseInt(hours);
                const ampm = hour >= 12 ? 'PM' : 'AM';
                const hour12 = hour % 12 || 12;
                const formattedTime = `${hour12}:${minutes} ${ampm}`;
                
                // Store both formats
                this.dataset.display = formattedTime;
                formState.formData.incidentTime = {
                    display: formattedTime,
                    value: this.value
                };
                
                clearError(this);
                formState.isDirty = true;
                saveFormState();
            } else {
                showError(this, 'Please select a time');
            }
            validateForm();
        });

        // If there's a saved value, display it
        if (formState.formData.incidentTime) {
            incidentTimeInput.value = formState.formData.incidentTime.value;
            incidentTimeInput.dataset.display = formState.formData.incidentTime.display;
        }
    }

    // Form validation
    function validateForm() {
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                showError(field, 'This field is required');
            } else {
                clearError(field);
            }
        });
        
        // Enable/disable next step button based on form validity
        nextStepBtn.disabled = !isValid;
        
        return isValid;
    }

    // Show error message
    function showError(field, message) {
        const errorDiv = field.nextElementSibling;
        if (errorDiv && errorDiv.classList.contains('form-error')) {
            errorDiv.textContent = message;
        }
        field.classList.add('invalid');
    }

    // Clear error message
    function clearError(field) {
        const errorDiv = field.nextElementSibling;
        if (errorDiv && errorDiv.classList.contains('form-error')) {
            errorDiv.textContent = '';
        }
        field.classList.remove('invalid');
    }

    // Add validation listeners to all required fields
    requiredFields.forEach(field => {
        field.addEventListener('input', () => {
            validateForm();
        });
        
        field.addEventListener('blur', () => {
            if (!field.value.trim()) {
                showError(field, 'This field is required');
            }
        });
    });

    // Form submission handling
    basicInfoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateForm()) {
            // Proceed to next step
            nextStepBtn.click();
        }
    });

    // Handle next step navigation
    document.querySelectorAll('.next-step').forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = parseInt(formState.currentStep);
            if (currentStep < 5) { // We have 5 steps total
                // Validate current step before proceeding
                if (currentStep === 1) {
                    // For step 1, just check if a claim type is selected
                    if (!formState.claimType) {
                        return;
                    }
                } else if (currentStep === 2) {
                    // For step 2, validate the form
                    if (!validateForm()) {
                        return;
                    }
                }

                // Mark current step as completed
                steps[currentStep - 1].classList.add('completed');
                
                // Hide current step
                formSteps[currentStep - 1].classList.remove('active');
                
                // Update current step
                formState.currentStep = currentStep + 1;
                
                // Show next step
                formSteps[formState.currentStep - 1].classList.add('active');
                
                // Update progress indicator
                steps[formState.currentStep - 1].classList.add('active');

                // Update form state
                formState.isDirty = true;
                saveFormState();

                // Update button state for next step
                updateNavigationButtons();

                // Scroll to top of the form
                document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Update navigation buttons based on current step
    function updateNavigationButtons() {
        const nextButtons = document.querySelectorAll('.next-step');
        
        nextButtons.forEach(button => {
            button.disabled = true;

            switch(formState.currentStep) {
                case 1:
                    button.disabled = !formState.claimType;
                    break;
                case 2:
                    button.disabled = !validateForm();
                    break;
                case 3:
                    button.disabled = !validatePersonalInfo();
                    break;
                case 4:
                    const acknowledgmentCheckbox = document.getElementById('requirements-acknowledged');
                    button.disabled = !acknowledgmentCheckbox?.checked;
                    break;
                case 5:
                    // Will be enabled when required documents are uploaded
                    break;
            }
        });
    }

    // Auto-save functionality
    function saveFormState() {
        if (formState.isDirty) {
            // Show saving indicator
            autoSaveIndicator.classList.add('visible');
            
            // Simulate API call to save form state
            setTimeout(() => {
                localStorage.setItem('claimFormState', JSON.stringify(formState));
                formState.isDirty = false;
                
                // Hide saving indicator after a brief delay
                setTimeout(() => {
                    autoSaveIndicator.classList.remove('visible');
                }, 1500);
            }, 1000);
        }
    }

    // Load saved form state
    function loadFormState() {
        const savedState = localStorage.getItem('claimFormState');
        if (savedState) {
            const parsedState = JSON.parse(savedState);
            formState = { ...formState, ...parsedState };
            
            // Restore UI state
            if (formState.claimType) {
                const selectedCard = document.querySelector(`[data-type="${formState.claimType}"]`);
                if (selectedCard) {
                    selectedCard.classList.add('selected');
                    nextButton.disabled = false;
                    // Populate incident type dropdown with saved claim type
                    populateIncidentTypes(formState.claimType);
                }
            }

            // Restore step progress
            if (formState.currentStep > 1) {
                // Update steps up to current
                for (let i = 1; i < formState.currentStep; i++) {
                    steps[i-1].classList.add('completed');
                }
                // Show current step
                formSteps[formState.currentStep - 1].classList.add('active');
                formSteps[0].classList.remove('active');
                steps[formState.currentStep - 1].classList.add('active');
                
                updateNavigationButtons();
            }
        }
    }

    // Help sidebar functionality
    document.addEventListener('click', function(e) {
        const helpIcon = e.target.closest('.help-icon');
        if (helpIcon) {
            const helpContent = helpIcon.dataset.help;
            showHelp(helpContent);
        }
    });

    function showHelp(content) {
        const helpContent = helpSidebar.querySelector('.help-content');
        helpContent.innerHTML = content;
        helpSidebar.classList.add('active');
    }

    closeHelpButton.addEventListener('click', function() {
        helpSidebar.classList.remove('active');
    });

    // Handle unsaved changes
    window.addEventListener('beforeunload', function(e) {
        if (formState.isDirty) {
            e.preventDefault();
            e.returnValue = '';
        }
    });

    // Initialize form
    loadFormState();

    // Accessibility
    claimTypeCards.forEach(card => {
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
    });

    // Handle time selection
    function updateTimeValidation() {
        const hour = incidentHourSelect.value;
        const minute = incidentMinuteSelect.value;
        const period = incidentPeriodSelect.value;
        
        const isTimeValid = hour && minute && period;
        
        // Update validation state
        [incidentHourSelect, incidentMinuteSelect, incidentPeriodSelect].forEach(select => {
            if (!select.value) {
                showError(select, 'Required');
            } else {
                clearError(select);
            }
        });
        
        // Update form state
        if (isTimeValid) {
            // Convert to 24-hour format for backend
            const hour24 = convertTo24Hour(hour, minute, period);
            formState.formData.incidentTime = hour24;
            formState.isDirty = true;
            saveFormState();
        }
        
        validateForm();
    }

    // Convert 12-hour time to 24-hour format
    function convertTo24Hour(hour, minute, period) {
        hour = parseInt(hour);
        if (period === 'PM' && hour !== 12) {
            hour += 12;
        } else if (period === 'AM' && hour === 12) {
            hour = 0;
        }
        return `${hour.toString().padStart(2, '0')}:${minute}`;
    }

    // Add event listeners for time selects
    if (incidentHourSelect && incidentMinuteSelect && incidentPeriodSelect) {
        [incidentHourSelect, incidentMinuteSelect, incidentPeriodSelect].forEach(select => {
            select.addEventListener('change', updateTimeValidation);
        });
    }

    // Validate personal information form
    function validatePersonalInfo() {
        let isValid = true;
        const requiredFields = document.querySelectorAll('#step3 [required]');
        const emailField = document.getElementById('email');
        const phoneField = document.getElementById('phone-number');

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                showError(field, 'This field is required');
            } else {
                clearError(field);
            }
        });

        // Validate phone number format
        if (phoneField.value.trim()) {
            const phonePattern = /^[0-9]{11}$/;
            if (!phonePattern.test(phoneField.value.trim())) {
                isValid = false;
                showError(phoneField, 'Please enter a valid 11-digit phone number');
            }
        }

        // Validate email format if provided
        if (emailField.value.trim()) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(emailField.value.trim())) {
                isValid = false;
                showError(emailField, 'Please enter a valid email address');
            }
        }

        return isValid;
    }

    // Add input event listeners for personal information fields
    const personalInfoForm = document.querySelector('.personal-info-form');
    if (personalInfoForm) {
        const fields = personalInfoForm.querySelectorAll('input');
        fields.forEach(field => {
            field.addEventListener('input', () => {
                if (formState.currentStep === 3) {
                    updateNavigationButtons();
                }
            });

            field.addEventListener('blur', () => {
                if (field.required && !field.value.trim()) {
                    showError(field, 'This field is required');
                }
            });
        });
    }

    // Function to show document requirements based on claim type
    function showRequirementsSection(claimType) {
        // Hide all requirements sections
        requirementsSections.forEach(section => {
            section.style.display = 'none';
        });

        // Show the selected requirements section
        const selectedSection = document.getElementById(`${claimType}Requirements`);
        if (selectedSection) {
            selectedSection.style.display = 'block';
        }

        // Reset acknowledgment checkbox
        acknowledgmentCheckbox.checked = false;
        updateSubmitButton();
    }

    // Function to update submit button state
    function updateSubmitButton() {
        submitButton.disabled = !acknowledgmentCheckbox.checked;
    }

    // Event listener for claim type change
    claimTypeSelect.addEventListener('change', function() {
        showRequirementsSection(this.value);
    });

    // Event listener for acknowledgment checkbox
    acknowledgmentCheckbox.addEventListener('change', updateSubmitButton);

    // Initialize with the default selected claim type
    showRequirementsSection(claimTypeSelect.value);
}); 