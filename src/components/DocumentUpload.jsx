import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUpload, FiArrowLeft } from 'react-icons/fi';
import '../css/document-upload.css';

const DocumentUpload = () => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    // Handle file drop
  };

  const handleBack = () => {
    // Hide current section (step5)
    const currentSection = document.getElementById('step5');
    if (currentSection) {
      currentSection.classList.remove('active');
    }

    // Show requirements section (step4)
    const requirementsSection = document.getElementById('step4');
    if (requirementsSection) {
      requirementsSection.classList.add('active');
    }

    // Update progress bar
    const currentStep = document.querySelector('.step[data-step="5"]');
    const previousStep = document.querySelector('.step[data-step="4"]');
    if (currentStep && previousStep) {
      currentStep.classList.remove('active');
      previousStep.classList.add('active');
    }
  };

  return (
    <div className="upload-page">
      <motion.div 
        className="upload-container"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div 
          className={`upload-area ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <FiUpload className="upload-icon" />
          <h2>Drag and drop your files here</h2>
          <p>or</p>
          <label className="browse-button">
            <input 
              type="file" 
              hidden 
              accept=".pdf,.jpg,.png,.docx"
              multiple
            />
            Browse Files
          </label>
          <p className="file-info">
            Supported formats: PDF, JPG, PNG, DOCX (Max 10MB per file)
          </p>
        </div>

        <div className="button-container">
          <button className="back-button" onClick={handleBack}>
            <FiArrowLeft />
            Previous
          </button>
          <button className="continue-button">Continue</button>
        </div>
      </motion.div>
    </div>
  );
};

export default DocumentUpload; 