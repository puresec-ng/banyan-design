'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

// Mock data for insurers and incident types
const insurers = [
  { id: 'INS001', name: 'Leadway Assurance' },
  { id: 'INS002', name: 'AXA Mansard' },
  { id: 'INS003', name: 'AIICO Insurance' },
  { id: 'INS004', name: 'Cornerstone Insurance' },
];

const incidentTypes = {
  MOTOR: [
    { id: 'MOT001', name: 'Accident' },
    { id: 'MOT002', name: 'Theft' },
    { id: 'MOT003', name: 'Breakdown' },
  ],
  SME: [
    { id: 'SME001', name: 'Fire Damage' },
    { id: 'SME002', name: 'Business Interruption' },
    { id: 'SME003', name: 'Property Damage' },
  ],
  GADGET: [
    { id: 'GAD001', name: 'Screen Damage' },
    { id: 'GAD002', name: 'Water Damage' },
    { id: 'GAD003', name: 'Theft' },
  ],
  HOUSEHOLDER: [
    { id: 'HOU001', name: 'Burglary' },
    { id: 'HOU002', name: 'Fire Damage' },
    { id: 'HOU003', name: 'Water Damage' },
  ],
  AGRO: [
    { id: 'AGR001', name: 'Crop Loss' },
    { id: 'AGR002', name: 'Equipment Damage' },
    { id: 'AGR003', name: 'Livestock Loss' },
  ],
};

interface FormData {
  insurer: string;
  incidentType: string;
  incidentDate: string;
  incidentTime: string;
  location: string;
  description: string;
  policyNumber: string;
}

export default function BasicInformation() {
  const router = useRouter();
  const [claimType, setClaimType] = useState<keyof typeof incidentTypes | ''>('');
  const [formData, setFormData] = useState<FormData>({
    insurer: '',
    incidentType: '',
    incidentDate: '',
    incidentTime: '',
    location: '',
    description: '',
    policyNumber: '',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const savedType = localStorage.getItem('claimType');
    if (!savedType) {
      router.push('/submit-claim');
      return;
    }
    setClaimType(savedType as keyof typeof incidentTypes);

    // Load saved form data if exists
    const savedData = localStorage.getItem('basicInfo');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, [router]);

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.insurer) newErrors.insurer = 'Please select an insurer';
    if (!formData.incidentType) newErrors.incidentType = 'Please select an incident type';
    if (!formData.incidentDate) newErrors.incidentDate = 'Please select the incident date';
    if (!formData.incidentTime) newErrors.incidentTime = 'Please select the incident time';
    if (!formData.location) newErrors.location = 'Please enter the incident location';
    if (!formData.description) {
      newErrors.description = 'Please describe the incident';
    } else if (formData.description.length < 50) {
      newErrors.description = 'Description must be at least 50 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));

    // Auto-save after 1 second of inactivity
    setIsSaving(true);
    const timer = setTimeout(() => {
      localStorage.setItem('basicInfo', JSON.stringify({ ...formData, [name]: value }));
      setIsSaving(false);
    }, 1000);

    return () => clearTimeout(timer);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      localStorage.setItem('basicInfo', JSON.stringify(formData));
      router.push('/submit-claim/payment');
    }
  };

  const handleBack = () => {
    router.push('/submit-claim');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 font-lato">
          Basic Information
        </h1>
        <p className="text-lg text-gray-600 font-roboto">
          Please provide details about your claim
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Insurer Selection */}
        <div>
          <label htmlFor="insurer" className="block text-sm font-medium text-gray-700 mb-1">
            Select Insurer
          </label>
          <select
            id="insurer"
            name="insurer"
            value={formData.insurer}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-[#004D40] focus:border-transparent
              ${errors.insurer ? 'border-red-300' : 'border-gray-300'}`}
          >
            <option value="">Select your insurance provider</option>
            {insurers.map(insurer => (
              <option key={insurer.id} value={insurer.id}>
                {insurer.name}
              </option>
            ))}
          </select>
          {errors.insurer && (
            <p className="mt-1 text-sm text-red-600">{errors.insurer}</p>
          )}
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
            className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-[#004D40] focus:border-transparent
              ${errors.incidentType ? 'border-red-300' : 'border-gray-300'}`}
          >
            <option value="">Select the type of incident</option>
            {claimType && incidentTypes[claimType].map(type => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
          {errors.incidentType && (
            <p className="mt-1 text-sm text-red-600">{errors.incidentType}</p>
          )}
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="incidentDate" className="block text-sm font-medium text-gray-700 mb-1">
              Incident Date
            </label>
            <input
              type="date"
              id="incidentDate"
              name="incidentDate"
              max={new Date().toISOString().split('T')[0]}
              value={formData.incidentDate}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-[#004D40] focus:border-transparent
                ${errors.incidentDate ? 'border-red-300' : 'border-gray-300'}`}
            />
            {errors.incidentDate && (
              <p className="mt-1 text-sm text-red-600">{errors.incidentDate}</p>
            )}
          </div>

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
              className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-[#004D40] focus:border-transparent
                ${errors.incidentTime ? 'border-red-300' : 'border-gray-300'}`}
            />
            {errors.incidentTime && (
              <p className="mt-1 text-sm text-red-600">{errors.incidentTime}</p>
            )}
          </div>
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Incident Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter the full address where the incident occurred"
            className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-[#004D40] focus:border-transparent
              ${errors.location ? 'border-red-300' : 'border-gray-300'}`}
          />
          {errors.location && (
            <p className="mt-1 text-sm text-red-600">{errors.location}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Incident Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Please provide a detailed description of what happened..."
            className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-[#004D40] focus:border-transparent
              ${errors.description ? 'border-red-300' : 'border-gray-300'}`}
          />
          <div className="mt-1 flex justify-between items-center">
            {errors.description ? (
              <p className="text-sm text-red-600">{errors.description}</p>
            ) : (
              <p className="text-sm text-gray-500">
                {formData.description.length}/500 characters (minimum 50)
              </p>
            )}
          </div>
        </div>

        {/* Policy Number */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <label htmlFor="policyNumber" className="block text-sm font-medium text-gray-700">
              Policy Number (Optional)
            </label>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500"
              title="Where to find your policy number"
            >
              <QuestionMarkCircleIcon className="w-4 h-4" />
            </button>
          </div>
          <input
            type="text"
            id="policyNumber"
            name="policyNumber"
            value={formData.policyNumber}
            onChange={handleChange}
            placeholder="Enter your policy number if available"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
          />
          <p className="mt-1 text-sm text-gray-500">
            You can find this on your insurance documents
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={handleBack}
            className="px-6 py-3 text-[#004D40] font-medium hover:bg-gray-50 rounded-xl transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-[#004D40] text-white font-medium rounded-xl hover:bg-[#003D30] transition-colors"
          >
            Continue to Payment Model
          </button>
        </div>
      </form>

      {/* Auto-save Indicator */}
      {isSaving && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg text-sm">
          Saving changes...
        </div>
      )}
    </div>
  );
} 