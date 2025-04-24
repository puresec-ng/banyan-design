document.addEventListener('DOMContentLoaded', function() {
    // Form state management
    const formState = {
        currentStep: 1,
        claimType: null,
        formData: {},
        isDirty: false
    };

    // DOM Elements
    const claimTypeCards = document.querySelectorAll('.claim-type-card');
    const nextButtons = document.querySelectorAll('.next-step');
    const backButtons = document.querySelectorAll('.btn-secondary');
    const progressSteps = document.querySelectorAll('.step');
    const progressLine = document.querySelector('.progress-completed');
    const helpToggle = document.querySelector('.help-toggle');
    const helpSidebar = document.querySelector('.help-sidebar');
    const autoSaveIndicator = document.querySelector('.auto-save-indicator');

    // Initialize mobile menu
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Claim type selection
    claimTypeCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove selection from other cards
            claimTypeCards.forEach(c => c.classList.remove('selected'));
            // Add selection to clicked card
            card.classList.add('selected');
            // Update form state
            formState.claimType = card.dataset.type;
            formState.isDirty = true;
            // Enable next button
            nextButtons.forEach(button => button.disabled = false);
            // Trigger auto-save
            triggerAutoSave();
        });
    });

    // Navigation buttons
    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (validateCurrentStep()) {
                showNextStep();
            }
        });
    });

    backButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (formState.currentStep > 1) {
                showPreviousStep();
            }
        });
    });

    // Help sidebar toggle
    if (helpToggle && helpSidebar) {
        helpToggle.addEventListener('click', () => {
            helpSidebar.classList.toggle('active');
        });
    }

    // Auto-save functionality
    let autoSaveTimeout;
    function triggerAutoSave() {
        if (!formState.isDirty) return;

        // Clear previous timeout
        clearTimeout(autoSaveTimeout);

        // Update save indicator
        updateAutoSaveIndicator('Saving...');

        // Set new timeout
        autoSaveTimeout = setTimeout(() => {
            saveFormData()
                .then(() => {
                    updateAutoSaveIndicator('All changes saved');
                    formState.isDirty = false;
                })
                .catch(() => {
                    updateAutoSaveIndicator('Failed to save');
                });
        }, 1000);
    }

    function updateAutoSaveIndicator(message) {
        const saveText = autoSaveIndicator.querySelector('.save-text');
        if (saveText) {
            saveText.textContent = message;
        }
    }

    // Form validation
    function validateCurrentStep() {
        switch(formState.currentStep) {
            case 1:
                return !!formState.claimType;
            // Add validation for other steps
            default:
                return true;
        }
    }

    // Navigation helpers
    function showNextStep() {
        if (formState.currentStep < 5) {
            const currentContent = document.getElementById(`step${formState.currentStep}`);
            const nextContent = document.getElementById(`step${formState.currentStep + 1}`);
            
            if (currentContent && nextContent) {
                currentContent.classList.remove('active');
                nextContent.classList.add('active');
                formState.currentStep++;
                updateProgress();
            }
        }
    }

    function showPreviousStep() {
        if (formState.currentStep > 1) {
            const currentContent = document.getElementById(`step${formState.currentStep}`);
            const previousContent = document.getElementById(`step${formState.currentStep - 1}`);
            
            if (currentContent && previousContent) {
                currentContent.classList.remove('active');
                previousContent.classList.add('active');
                formState.currentStep--;
                updateProgress();
            }
        }
    }

    // Progress bar update
    function updateProgress() {
        // Update step status
        progressSteps.forEach((step, index) => {
            if (index + 1 < formState.currentStep) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else if (index + 1 === formState.currentStep) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('completed', 'active');
            }
        });

        // Update progress line
        const progress = ((formState.currentStep - 1) / (progressSteps.length - 1)) * 100;
        progressLine.style.width = `${progress}%`;
    }

    // Save form data
    async function saveFormData() {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                // Save to localStorage for now
                localStorage.setItem('claimFormData', JSON.stringify(formState));
                resolve();
            }, 500);
        });
    }

    // Load saved form data
    function loadSavedData() {
        const savedData = localStorage.getItem('claimFormData');
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            formState.claimType = parsedData.claimType;
            formState.formData = parsedData.formData;

            // Restore claim type selection
            if (formState.claimType) {
                const selectedCard = document.querySelector(`[data-type="${formState.claimType}"]`);
                if (selectedCard) {
                    selectedCard.classList.add('selected');
                    nextButtons.forEach(button => button.disabled = false);
                }
            }
        }
    }

    // Handle page unload
    window.addEventListener('beforeunload', (e) => {
        if (formState.isDirty) {
            e.preventDefault();
            e.returnValue = '';
        }
    });

    // Initialize
    loadSavedData();
    updateProgress();
}); 