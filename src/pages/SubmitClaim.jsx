import React, { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../css/submit-claim.css';

const SubmitClaim = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        claimType: '',
        basicInfo: {},
        personalInfo: {},
        requirements: {},
        documents: []
    });

    const steps = [
        { number: 1, label: "Claim Type" },
        { number: 2, label: "Basic Info" },
        { number: 3, label: "Personal Info" },
        { number: 4, label: "Requirements" },
        { number: 5, label: "Documents" }
    ];

    const claimTypes = [
        {
            id: 'MOTOR',
            title: 'Motor Claims',
            description: 'File a claim for vehicle damage, accidents, or theft',
            icon: 'car'
        },
        {
            id: 'SME',
            title: 'SME Claims',
            description: 'Business-related claims for small and medium enterprises',
            icon: 'building'
        },
        {
            id: 'AGRO',
            title: 'Agro Claims',
            description: 'Claims related to agricultural losses and damages',
            icon: 'leaf'
        },
        {
            id: 'GADGET',
            title: 'Gadget Claims',
            description: 'Claims for electronic devices and gadgets',
            icon: 'mobile-alt'
        },
        {
            id: 'HOUSEHOLDER',
            title: 'Householder Claims',
            description: 'Claims for home-related damages and losses',
            icon: 'home'
        }
    ];

    const handleClaimTypeSelect = (claimType) => {
        setFormData({ ...formData, claimType });
    };

    return (
        <div className="claim-submission">
            {/* Progress Steps */}
            <div className="progress-steps">
                {steps.map((step) => (
                    <div
                        key={step.number}
                        className={`step ${currentStep === step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}
                    >
                        <div className="step-number">{step.number}</div>
                        <div className="step-label">{step.label}</div>
                    </div>
                ))}
            </div>

            {/* Form Container */}
            <div className="form-container">
                {currentStep === 1 && (
                    <div className="claim-types">
                        {claimTypes.map((type) => (
                            <div
                                key={type.id}
                                className={`claim-type ${formData.claimType === type.id ? 'selected' : ''}`}
                                onClick={() => handleClaimTypeSelect(type.id)}
                            >
                                <div className="claim-type-icon">
                                    <i className={`fas fa-${type.icon}`}></i>
                                </div>
                                <h3>{type.title}</h3>
                                <p>{type.description}</p>
                            </div>
                        ))}
                    </div>
                )}
                
                {/* Add other step content here */}
            </div>
        </div>
    );
};

export default SubmitClaim; 