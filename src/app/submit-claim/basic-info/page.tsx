'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const INSURANCE_PROVIDERS = [
  'Allianz Insurance',
  'AXA Insurance',
  'Prudential Insurance',
  'Liberty Insurance',
  'Zurich Insurance',
  'Other'
];

const INCIDENT_TYPES = [
  'Accident',
  'Theft',
  'Natural Disaster',
  'Fire Damage',
  'Water Damage',
  'Other'
];

export default function BasicInfo() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    insuranceProvider: '',
    incidentType: '',
    incidentDate: '',
    incidentTime: '',
    incidentDescription: '',
    policyNumber: ''
  });

  useEffect(() => {
    // Check if user has completed previous steps
    const selectedType = localStorage.getItem('selectedClaimType');
    if (!selectedType) {
      router.push('/submit-claim');
      return;
    }

    // Load saved form data if it exists
    const savedData = localStorage.getItem('basicInfo');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBack = () => {
    router.push('/submit-claim');
  };

  const handleContinue = () => {
    if (isFormValid()) {
      localStorage.setItem('basicInfo', JSON.stringify(formData));
      router.push('/submit-claim/personal-info');
    }
  };

  const isFormValid = () => {
    return formData.insuranceProvider &&
           formData.incidentType &&
           formData.incidentDate &&
           formData.incidentTime &&
           formData.incidentDescription;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
        
        <div className="space-y-6">
          {/* Insurance Provider */}
          <div>
            <label htmlFor="insuranceProvider" className="block text-sm font-medium text-gray-700 mb-1">
              Insurance Provider
            </label>
            <select
              id="insuranceProvider"
              name="insuranceProvider"
              value={formData.insuranceProvider}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
              required
            >
              <option value="">Select Insurance Provider</option>
              {INSURANCE_PROVIDERS.map((provider) => (
                <option key={provider} value={provider}>{provider}</option>
              ))}
            </select>
          </div>

          {/* Incident Type */}
          <div>
            <label htmlFor="incidentType" className="block text-sm font-medium text-gray-700 mb-1">
              Incident Type
            </label>
            <select
              id="incidentType"
              name="incidentType"
              value={formData.incidentType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
              required
            >
              <option value="">Select Incident Type</option>
              {INCIDENT_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Incident Date */}
          <div>
            <label htmlFor="incidentDate" className="block text-sm font-medium text-gray-700 mb-1">
              Incident Date
            </label>
            <input
              type="date"
              id="incidentDate"
              name="incidentDate"
              value={formData.incidentDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
              required
            />
          </div>

          {/* Incident Time */}
          <div>
            <label htmlFor="incidentTime" className="block text-sm font-medium text-gray-700 mb-1">
              Incident Time
            </label>
            <input
              type="time"
              id="incidentTime"
              name="incidentTime"
              value={formData.incidentTime}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
              required
            />
          </div>

          {/* Incident Description */}
          <div>
            <label htmlFor="incidentDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Incident Description
            </label>
            <textarea
              id="incidentDescription"
              name="incidentDescription"
              value={formData.incidentDescription}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
              placeholder="Please provide a detailed description of the incident"
              required
            />
          </div>

          {/* Policy Number */}
          <div>
            <label htmlFor="policyNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Policy Number (Optional)
            </label>
            <input
              type="text"
              id="policyNumber"
              name="policyNumber"
              value={formData.policyNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
              placeholder="Enter your policy number if available"
            />
          </div>
        </div>
      </form>

      {/* Navigation Buttons */}
      <div className="mt-8 flex justify-between">
        <button
          onClick={handleBack}
          className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          disabled={!isFormValid()}
          className="px-6 py-2 bg-[#004D40] text-white rounded-lg hover:bg-[#003D30] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
} 