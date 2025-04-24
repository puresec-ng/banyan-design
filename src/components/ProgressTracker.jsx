import React from 'react';
import PropTypes from 'prop-types';

const ProgressTracker = ({ currentStep, onStepClick, onNext, onPrevious }) => {
    const steps = [
        { label: 'Claim\nType', number: 1 },
        { label: 'Basic\nInfo', number: 2 },
        { label: 'Personal\nInfo', number: 3 },
        { label: 'Requirements', number: 4 },
        { label: 'Upload\nDocuments', number: 5 }
    ];

    return (
        <div className="w-full max-w-5xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-8">
                {/* Progress Steps */}
                <div className="relative flex justify-between items-start">
                    {steps.map((step, index) => (
                        <div 
                            key={step.number}
                            className="relative flex flex-col items-center w-1/5"
                            onClick={() => onStepClick(step.number)}
                        >
                            {/* Connecting Line */}
                            {index < steps.length - 1 && (
                                <div 
                                    className={`absolute top-5 left-[50%] w-full h-[2px] ${
                                        step.number <= currentStep ? 'bg-emerald-700' : 'bg-gray-200'
                                    }`}
                                />
                            )}
                            
                            {/* Step Circle */}
                            <button 
                                className={`
                                    relative z-10 w-10 h-10 rounded-full flex items-center justify-center 
                                    font-semibold text-lg transition-colors cursor-pointer
                                    ${step.number <= currentStep 
                                        ? 'bg-emerald-700 text-white border-emerald-700' 
                                        : 'bg-orange-500 text-black border-orange-500'
                                    }
                                `}
                            >
                                {step.number}
                            </button>

                            {/* Step Label */}
                            <span 
                                className={`
                                    mt-3 text-sm text-center whitespace-pre-line
                                    ${step.number <= currentStep ? 'text-emerald-700 font-semibold' : 'text-gray-500'}
                                `}
                            >
                                {step.label}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                    <button
                        onClick={onPrevious}
                        disabled={currentStep === 1}
                        className={`
                            px-6 py-2 rounded-lg font-medium
                            ${currentStep === 1
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }
                        `}
                    >
                        Previous
                    </button>
                    <button
                        onClick={onNext}
                        disabled={currentStep === 5}
                        className={`
                            px-6 py-2 rounded-lg font-medium
                            ${currentStep === 5
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-emerald-700 text-white hover:bg-emerald-800'
                            }
                        `}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

ProgressTracker.propTypes = {
    currentStep: PropTypes.number.isRequired,
    onStepClick: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired,
    onPrevious: PropTypes.func.isRequired
};

export default ProgressTracker; 