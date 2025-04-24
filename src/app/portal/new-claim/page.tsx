'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  DocumentTextIcon,
  PhotoIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

type ClaimType = 'MOTOR' | 'GADGET' | 'PROPERTY' | 'BUSINESS';

interface FormData {
  type: ClaimType;
  insuranceProvider: string;
  incidentType: string;
  incidentDate: string;
  incidentTime: string;
  description: string;
  policyNumber: string;
  documents: File[];
  additionalInfo: string;
}

const CLAIM_TYPES = [
  { id: 'MOTOR', name: 'Motor Insurance', description: 'Claims for vehicle damage or accidents' },
  { id: 'GADGET', name: 'Gadget Insurance', description: 'Claims for electronic devices and gadgets' },
  { id: 'PROPERTY', name: 'Property Insurance', description: 'Claims for property damage or loss' },
  { id: 'BUSINESS', name: 'Business Insurance', description: 'Claims for business-related incidents' },
];

const INSURANCE_PROVIDERS = [
  'AXA Mansard Insurance',
  'Leadway Assurance',
  'AIICO Insurance',
  'Cornerstone Insurance',
  'NEM Insurance',
  'Mutual Benefits Assurance',
  'Other',
];

const INCIDENT_TYPES = {
  MOTOR: [
    'Accident',
    'Theft',
    'Fire Damage',
    'Natural Disaster',
    'Vandalism',
    'Mechanical Breakdown',
  ],
  GADGET: [
    'Accidental Damage',
    'Liquid Damage',
    'Theft',
    'Loss',
    'Mechanical Failure',
    'Screen Damage',
  ],
  PROPERTY: [
    'Fire Damage',
    'Water Damage',
    'Burglary',
    'Natural Disaster',
    'Structural Damage',
    'Vandalism',
  ],
  BUSINESS: [
    'Property Damage',
    'Business Interruption',
    'Equipment Breakdown',
    'Theft',
    'Employee Injury',
    'Professional Liability',
  ],
};

export default function NewClaim() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    type: 'MOTOR',
    insuranceProvider: '',
    incidentType: '',
    incidentDate: '',
    incidentTime: '',
    description: '',
    policyNumber: '',
    documents: [],
    additionalInfo: '',
  });

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      router.push('/portal');
    }
  }, [router]);

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Here you would typically send the form data to your API
      console.log('Submitting claim:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store claim data in localStorage for demo purposes
      const claims = JSON.parse(localStorage.getItem('claims') || '[]');
      const newClaim = {
        ...formData,
        id: `CLM${String(claims.length + 1).padStart(3, '0')}`,
        status: 'SUBMITTED',
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        history: [
          {
            date: new Date().toISOString(),
            status: 'SUBMITTED',
            note: 'Claim submitted successfully'
          }
        ]
      };
      claims.push(newClaim);
      localStorage.setItem('claims', JSON.stringify(claims));

      // Navigate back to dashboard
      router.push('/portal/dashboard');
    } catch (error) {
      console.error('Error submitting claim:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-200 -z-10"></div>
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  step <= currentStep ? 'bg-[#004D40] text-white' : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step < currentStep ? (
                  <CheckCircleIcon className="w-5 h-5" />
                ) : (
                  <span>{step}</span>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-sm font-medium">Claim Type</span>
            <span className="text-sm font-medium">Details</span>
            <span className="text-sm font-medium">Documents</span>
            <span className="text-sm font-medium">Review</span>
          </div>
        </div>

        {/* Step 1: Claim Type */}
        {currentStep === 1 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Select Claim Type</h2>
            <div className="grid gap-4">
              {CLAIM_TYPES.map((type) => (
                <label
                  key={type.id}
                  className={`flex items-start p-4 border rounded-xl cursor-pointer transition-colors ${
                    formData.type === type.id
                      ? 'border-[#004D40] bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="claimType"
                    value={type.id}
                    checked={formData.type === type.id}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as ClaimType })}
                    className="sr-only"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{type.name}</div>
                    <div className="text-sm text-gray-500 mt-1">{type.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Claim Details */}
        {currentStep === 2 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Claim Details</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Insurance Provider
                </label>
                <select
                  value={formData.insuranceProvider}
                  onChange={(e) => setFormData({ ...formData, insuranceProvider: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
                >
                  <option value="">Select Insurance Provider</option>
                  {INSURANCE_PROVIDERS.map((provider) => (
                    <option key={provider} value={provider}>
                      {provider}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Incident Type
                </label>
                <select
                  value={formData.incidentType}
                  onChange={(e) => setFormData({ ...formData, incidentType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
                >
                  <option value="">Select Incident Type</option>
                  {INCIDENT_TYPES[formData.type].map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Incident Date
                  </label>
                  <input
                    type="date"
                    value={formData.incidentDate}
                    onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Incident Time
                  </label>
                  <input
                    type="time"
                    value={formData.incidentTime}
                    onChange={(e) => setFormData({ ...formData, incidentTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description of Incident
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
                  placeholder="Please provide detailed description of the incident..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Policy Number (Optional)
                </label>
                <input
                  type="text"
                  value={formData.policyNumber}
                  onChange={(e) => setFormData({ ...formData, policyNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
                  placeholder="Enter your policy number if available"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Documents */}
        {currentStep === 3 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Upload Documents</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
              <input
                type="file"
                multiple
                className="hidden"
                id="document-upload"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setFormData({ ...formData, documents: files });
                }}
              />
              <label
                htmlFor="document-upload"
                className="cursor-pointer text-[#004D40] hover:text-[#003D30]"
              >
                <PhotoIcon className="w-12 h-12 mx-auto mb-4" />
                <p className="text-lg font-medium">Upload Documents</p>
                <p className="text-sm text-gray-500 mt-1">
                  Drag and drop files here, or click to select files
                </p>
              </label>
            </div>
            {formData.documents.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium text-gray-900 mb-3">Uploaded Files</h3>
                <ul className="space-y-2">
                  {formData.documents.map((file, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <DocumentTextIcon className="w-5 h-5" />
                      {file.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Review - Updated with comprehensive sections */}
        {currentStep === 4 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Review Your Claim</h2>
            
            {/* Claim Information Section */}
            <div className="space-y-6">
              <div className="border-b pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Claim Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-sm text-gray-500">Claim Type</span>
                    <span className="block text-base text-gray-900 mt-1">
                      {CLAIM_TYPES.find(type => type.id === formData.type)?.name}
                    </span>
                  </div>
                  <div>
                    <span className="block text-sm text-gray-500">Insurance Provider</span>
                    <span className="block text-base text-gray-900 mt-1">
                      {formData.insuranceProvider || 'Not specified'}
                    </span>
                  </div>
                  <div>
                    <span className="block text-sm text-gray-500">Policy Number</span>
                    <span className="block text-base text-gray-900 mt-1">
                      {formData.policyNumber || 'Not provided'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Incident Details Section */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Incident Details</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="block text-sm text-gray-500">Incident Type</span>
                    <span className="block text-base text-gray-900 mt-1">
                      {formData.incidentType}
                    </span>
                  </div>
                  <div>
                    <span className="block text-sm text-gray-500">Date & Time</span>
                    <span className="block text-base text-gray-900 mt-1">
                      {new Date(`${formData.incidentDate}T${formData.incidentTime}`).toLocaleString('en-GB', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="block text-sm text-gray-500">Description</span>
                  <span className="block text-base text-gray-900 mt-1 whitespace-pre-wrap">
                    {formData.description || 'No description provided'}
                  </span>
                </div>
              </div>

              {/* Documents Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Supporting Documents</h3>
                {formData.documents.length > 0 ? (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <ul className="space-y-3">
                      {formData.documents.map((file, index) => (
                        <li key={index} className="flex items-center gap-3 text-gray-700">
                          <DocumentTextIcon className="w-5 h-5 text-gray-500" />
                          <div>
                            <span className="font-medium">{file.name}</span>
                            <span className="text-sm text-gray-500 ml-2">
                              ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-gray-500">No documents uploaded</p>
                )}
              </div>

              {/* Confirmation Notice */}
              <div className="mt-6 bg-yellow-50 border border-yellow-100 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  Please review all information carefully before submitting. Once submitted, you'll receive a confirmation email with your claim reference number.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between">
          {currentStep > 1 && (
            <button
              onClick={handleBack}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors disabled:opacity-50"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Back
            </button>
          )}
          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2 bg-[#004D40] text-white rounded-xl hover:bg-[#003D30] transition-colors ml-auto disabled:opacity-50"
            >
              Next
              <ArrowRightIcon className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2 bg-[#004D40] text-white rounded-xl hover:bg-[#003D30] transition-colors ml-auto disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  Submit Claim
                  <CheckCircleIcon className="w-5 h-5" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </main>
  );
} 