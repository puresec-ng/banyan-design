'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import AdditionalInfoRequestComponent from '../../components/AdditionalInfoRequest';
import { useToast } from '../../context/ToastContext';

function RequestResponseContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  
  const [claimId, setClaimId] = useState<string>('');
  const [requestType, setRequestType] = useState<'document_request' | 'additional_information'>('document_request');

  useEffect(() => {
    const claimIdParam = searchParams.get('claimId');
    const requestTypeParam = searchParams.get('requestType') as 'document_request' | 'additional_information';
    
    if (!claimIdParam) {
      showToast('Claim ID is required', 'error');
      router.push('/portal/track-claim');
      return;
    }
    
    setClaimId(claimIdParam);
    setRequestType(requestTypeParam || 'document_request');
  }, [searchParams, router, showToast]);

  const handleComplete = () => {
    showToast('Response submitted successfully!', 'success');
    router.push(`/portal/track-claim?claimId=${claimId}`);
  };

  const handleBack = () => {
    router.push(`/portal/track-claim?claimId=${claimId}`);
  };

  if (!claimId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Claim Details
          </button>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {requestType === 'document_request' ? 'Document Request' : 'Additional Information Request'}
            </h1>
            <p className="text-gray-600">
              Please provide the requested information and documents for claim {claimId}.
            </p>
          </div>
        </div>

        {/* Request Component */}
        <AdditionalInfoRequestComponent
          claimId={claimId}
          requestType={requestType}
          onComplete={handleComplete}
        />
      </div>
    </div>
  );
}

export default function RequestResponsePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <RequestResponseContent />
    </Suspense>
  );
}
