'use client';

import { useState } from 'react';
import AdditionalInfoRequestComponent from '../components/AdditionalInfoRequest';

export default function TestUI() {
  const [claimId, setClaimId] = useState('LIF-2025-00009');
  const [requestType, setRequestType] = useState<'document_request' | 'additional_information'>('document_request');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Test Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Additional Information Request - Test UI</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Claim ID
              </label>
              <input
                type="text"
                value={claimId}
                onChange={(e) => setClaimId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter claim ID"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Request Type
              </label>
              <select
                value={requestType}
                onChange={(e) => setRequestType(e.target.value as 'document_request' | 'additional_information')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="document_request">Document Request</option>
                <option value="additional_information">Additional Information</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 rounded-md">
            <h3 className="text-sm font-medium text-blue-900 mb-2">API Endpoint:</h3>
            <code className="text-sm text-blue-800">
              GET /api/v1/claims/additional-information-requests/{claimId}?request_type={requestType}
            </code>
          </div>
        </div>

        {/* Component Display */}
        <AdditionalInfoRequestComponent
          claimId={claimId}
          requestType={requestType}
          onComplete={() => {
            console.log('Request completed!');
            alert('Request completed successfully!');
          }}
        />
      </div>
    </div>
  );
}