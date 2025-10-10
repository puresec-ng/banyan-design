'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  CheckCircleIcon,
  ExclamationCircleIcon,
  DocumentIcon,
} from '@heroicons/react/24/outline';

const claimTypeLabels = {
  MOTOR: 'Motor Claims',
  SME: 'SME Claims',
  GADGET: 'Gadget Claims',
  HOUSEHOLDER: 'Householder Claims',
  AGRO: 'Agro Claims',
};

const paymentModelLabels = {
  DIRECT: 'Direct Payment',
  REPAIR: 'Repair Network',
  REPLACEMENT: 'Replacement',
};

interface BasicInfo {
  insurer: string;
  incidentType: string;
  incidentDate: string;
  incidentTime: string;
  location: string;
  description: string;
  policyNumber?: string;
}

export default function ReviewClaim() {
  const router = useRouter();
  const [claimType, setClaimType] = useState('');
  const [basicInfo, setBasicInfo] = useState<BasicInfo | null>(null);
  const [paymentModel, setPaymentModel] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load all saved data
    const savedType = localStorage.getItem('claimType');
    const savedInfo = localStorage.getItem('basicInfo');
    const savedPayment = localStorage.getItem('paymentModel');
    const savedFiles = localStorage.getItem('uploadedDocuments');

    if (!savedType || !savedInfo || !savedPayment || !savedFiles) {
      router.push('/submit-claim');
      return;
    }

    setClaimType(savedType);
    setBasicInfo(JSON.parse(savedInfo));
    setPaymentModel(savedPayment);
    setUploadedFiles(JSON.parse(savedFiles));
  }, [router]);

  const handleEdit = (section: string) => {
    router.push(`/submit-claim/${section}`);
  };

  const handleSubmit = async () => {
    try {
      // Here you would typically send the data to your backend
      const formData = {
        claimType,
        basicInfo,
        paymentModel,
        uploadedFiles,
        submittedAt: new Date().toISOString(),
      };

      // For demo purposes, we'll just simulate an API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Clear local storage after successful submission
      localStorage.removeItem('claimType');
      localStorage.removeItem('basicInfo');
      localStorage.removeItem('paymentModel');
      localStorage.removeItem('uploadedDocuments');

      // Navigate to success page
      router.push('/submit-claim/success');
    } catch (err) {
      setError('Failed to submit claim. Please try again.');
    }
  };

  if (!basicInfo) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 font-lato">
          Review Your Claim
        </h1>
        <p className="text-lg text-gray-600 font-roboto">
          Please review all information before submitting your claim
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 rounded-xl flex items-center gap-3 text-red-700">
          <ExclamationCircleIcon className="w-5 h-5" />
          <p>{error}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Claim Type Section */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Claim Type</h2>
            <button
              onClick={() => handleEdit('')}
              className="text-[#004D40] hover:text-[#003D30] font-medium"
            >
              Edit
            </button>
          </div>
          <p className="text-gray-700">{claimTypeLabels[claimType as keyof typeof claimTypeLabels]}</p>
        </div>

        {/* Basic Information Section */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
            <button
              onClick={() => handleEdit('basic-info')}
              className="text-[#004D40] hover:text-[#003D30] font-medium"
            >
              Edit
            </button>
          </div>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Incident Type</dt>
              <dd className="text-gray-900">{basicInfo.incidentType}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Incident Date & Time</dt>
              <dd className="text-gray-900">
                {new Date(`${basicInfo.incidentDate}T${basicInfo.incidentTime}`).toLocaleString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}
              </dd>
            </div>
            <div className="md:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Location</dt>
              <dd className="text-gray-900">{basicInfo.location}</dd>
            </div>
            <div className="md:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="text-gray-900">{basicInfo.description}</dd>
            </div>
            {basicInfo.policyNumber && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Policy Number</dt>
                <dd className="text-gray-900">{basicInfo.policyNumber}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* Payment Model Section */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Payment Model</h2>
            <button
              onClick={() => handleEdit('payment')}
              className="text-[#004D40] hover:text-[#003D30] font-medium"
            >
              Edit
            </button>
          </div>
          <p className="text-gray-700">{paymentModelLabels[paymentModel as keyof typeof paymentModelLabels]}</p>
        </div>

        {/* Documents Section */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Uploaded Documents</h2>
            <button
              onClick={() => handleEdit('documents')}
              className="text-[#004D40] hover:text-[#003D30] font-medium"
            >
              Edit
            </button>
          </div>
          <div className="space-y-3">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="flex items-center gap-3">
                <DocumentIcon className="w-5 h-5 text-[#004D40]" />
                <span className="text-gray-700">{file.file.name}</span>
                <CheckCircleIcon className="w-5 h-5 text-green-500 ml-auto" />
              </div>
            ))}
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="bg-blue-50 rounded-xl p-6">
          <p className="text-sm text-blue-800">
            By submitting this claim, you confirm that all provided information is accurate and complete.
            False or misleading information may result in the rejection of your claim and possible legal consequences.
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-8">
          <button
            type="button"
            onClick={() => handleEdit('documents')}
            className="px-6 py-3 text-[#004D40] font-medium hover:bg-gray-50 rounded-xl transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-[#004D40] text-white font-medium rounded-xl hover:bg-[#003D30] transition-colors"
          >
            Submit Claim
          </button>
        </div>
      </div>
    </div>
  );
} 