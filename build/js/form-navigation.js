document.addEventListener('DOMContentLoaded', function() {
    // Initialize form steps
    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-steps .step');
    
    function showStep(stepNumber) {
        // Hide all steps
        steps.forEach(step => step.classList.remove('active'));
        progressSteps.forEach(step => step.classList.remove('active'));
        
        // Show the target step
        const targetStep = document.querySelector(`#step${stepNumber}`);
        const targetProgressStep = document.querySelector(`[data-step="${stepNumber}"]`);
        
        if (targetStep && targetProgressStep) {
            targetStep.classList.add('active');
            targetProgressStep.classList.add('active');
        }
    }

    // Handle next button clicks
    document.querySelectorAll('.next-step').forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = document.querySelector('.form-step.active');
            const currentStepNumber = parseInt(currentStep.id.replace('step', ''));
            showStep(currentStepNumber + 1);
        });
    });

    // Handle previous button clicks
    document.querySelectorAll('.back-button').forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = document.querySelector('.form-step.active');
            const currentStepNumber = parseInt(currentStep.id.replace('step', ''));
            if (currentStepNumber > 1) {
                showStep(currentStepNumber - 1);
            }
        });
    });
}); 