'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, ArrowRightIcon, DocumentTextIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { getIncidentTypes, IncidentType, submitClaim } from '../../services/public';
import { useQuery } from "@tanstack/react-query";
import { useToast } from '../../context/ToastContext';


export default function DocumentRequirements() {
  const router = useRouter();
  const { showToast } = useToast();
  const [claimType, setClaimType] = useState<string>('');
  const [documents, setDocuments] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const { data: incidentTypes } = useQuery<IncidentType[]>({
    queryKey: ['incidentTypes'],
    queryFn: getIncidentTypes,
  });

  useEffect(() => {
    // Check if user has completed previous steps
    const personalInfo = localStorage.getItem('personalInfo');
    const basicInfo = localStorage.getItem('basicInfo');

    if (!personalInfo) {
      router.push('/submit-claim/personal-info');
      return;
    }

    if (basicInfo) {
      const { incidentType } = JSON.parse(basicInfo);
      if (incidentType && incidentTypes) {
        const selectedIncidentType = incidentTypes.find(t => t.name === incidentType);
        if (selectedIncidentType) {
          setDocuments(JSON.parse(selectedIncidentType.required_documents || '[]'));
        }
      }
    }
  }, [router, incidentTypes]);

  const handleBack = () => {
    router.push('/submit-claim/personal-info');
  };

  const handleContinue = () => {
    router.push('/submit-claim/documents');
  };

  const handleSkip = async () => {
    try {
      setIsSubmitting(true);
      // Get all the required data from localStorage
      const personalInfo = JSON.parse(localStorage.getItem('personalInfo') || '{}');
      const basicInfo = JSON.parse(localStorage.getItem('basicInfo') || '{}');
      const selectedClaimType = JSON.parse(localStorage.getItem('selectedClaimType') || '{}');

      const samplePayload = {
        first_name: personalInfo.firstName,
        last_name: personalInfo.lastName,
        phone: personalInfo.phoneNumber,
        email: personalInfo.email,
        claim_type: selectedClaimType,
        incident_type: basicInfo.incident_type,
        incident_date: `${basicInfo.incidentDate} ${basicInfo.incidentTime}:00`,
        incident_location: basicInfo.incidentLocation,
        description: basicInfo.incidentDescription,
        policy_number: basicInfo.policyNumber,
        insurer_id: basicInfo.insurer_id,
        payment_model: 1
      }

      console.log(samplePayload, 'samplePayload');

      // // Prepare the claim payload
      const claimPayload = {
        // ...personalInfo,
        // ...basicInfo,
        ...samplePayload,
        documents: []
      };

      // Submit the claim
      const response = await submitClaim(claimPayload);
      console.log(response, 'response_____');
      const getSubmissionDetails = await localStorage.getItem('submissionDetails');
      localStorage.setItem('submissionDetails', JSON.stringify({
        ...JSON.parse(getSubmissionDetails || '{}'),
        trackingNumber: response.data.claim_number
      }));

      // Store empty documents array to indicate user skipped
      localStorage.setItem('documents', JSON.stringify([]));
      emptyStoredData();

      // Navigate to success page
      router.push('/submit-claim/success');
    } catch (error: any) {
      showToast(error.response.data.message || 'Failed to submit claim. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const emptyStoredData = () => {
    localStorage.removeItem('personalInfo');
    localStorage.removeItem('basicInfo');
    localStorage.removeItem('selectedClaimType');
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Required Documents</h2>
        <p className="text-gray-600 mb-6">
          The following documents are required for your claim. You can upload them now or submit your claim and upload them later.
        </p>

        <div className="space-y-4">
          {documents.map((doc) => (
            <div key={doc} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <DocumentTextIcon className="w-6 h-6 text-[#004D40] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900">{doc}</h3>
                </div>
              </div>
            </div>
          ))}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <DocumentTextIcon className="w-6 h-6 text-[#004D40] flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-medium text-gray-900">Any additional document</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> You can proceed without uploading documents now and submit them later through your dashboard.
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-8 flex justify-between">
        <button
          onClick={handleBack}
          className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          disabled={isSubmitting}
        >
          Back
        </button>
        <div className="flex gap-3">
          <button
            onClick={handleSkip}
            disabled={isSubmitting}
            className="px-6 py-2 text-[#004D40] border border-[#004D40] rounded-lg hover:bg-[#E0F2F1] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-[#004D40]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              'Submit Without Documents'
            )}
          </button>
          <button
            onClick={handleContinue}
            disabled={isSubmitting}
            className="px-6 py-2 bg-[#004D40] text-white rounded-lg hover:bg-[#003D30] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Upload Documents
          </button>
        </div>
      </div>
    </div>
  );
} 