'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

export default function SubmissionSuccess() {
  const router = useRouter();

  useEffect(() => {
    // Clear any remaining form data
    localStorage.removeItem('claimType');
    localStorage.removeItem('basicInfo');
    localStorage.removeItem('paymentModel');
    localStorage.removeItem('uploadedDocuments');
  }, []);

  const handleNewClaim = () => {
    router.push('/submit-claim');
  };

  const handleDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircleIcon className="w-10 h-10 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4 font-lato">
          Claim Submitted Successfully
        </h1>
        <p className="text-lg text-gray-600 font-roboto">
          Thank you for submitting your claim. Our team will review it shortly.
        </p>
      </div>

      <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">What's Next?</h2>
        <div className="space-y-4 text-left">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[#004D40] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
              1
            </div>
            <p className="text-gray-600">
              You will receive a confirmation email with your claim reference number within the next hour.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[#004D40] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
              2
            </div>
            <p className="text-gray-600">
              Our claims team will review your submission and may contact you if additional information is needed.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[#004D40] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
              3
            </div>
            <p className="text-gray-600">
              You can track the status of your claim through your dashboard using your claim reference number.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl p-6 mb-8">
        <h3 className="font-semibold text-blue-900 mb-2">Need Assistance?</h3>
        <p className="text-blue-800 text-sm">
          If you have any questions about your claim, please contact our support team at{' '}
          <a href="tel:+2348012345678" className="font-medium hover:text-blue-600">
            +234 801 234 5678
          </a>
          {' '}or email us at{' '}
          <a href="mailto:support@banyanclaims.com" className="font-medium hover:text-blue-600">
            support@banyanclaims.com
          </a>
        </p>
      </div>

      <div className="flex gap-4 justify-center">
        <button
          onClick={handleNewClaim}
          className="px-6 py-3 bg-white border-2 border-[#004D40] text-[#004D40] font-medium rounded-xl hover:bg-[#F0F7F5] transition-colors"
        >
          Submit Another Claim
        </button>
        <button
          onClick={handleDashboard}
          className="px-6 py-3 bg-[#004D40] text-white font-medium rounded-xl hover:bg-[#003D30] transition-colors"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
} 