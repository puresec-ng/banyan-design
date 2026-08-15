'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  MagnifyingGlassIcon,
  ExclamationCircleIcon,
  DocumentTextIcon,
  ArrowRightIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { trackClaim, ClaimData } from '@/app/services/dashboard';
import cookie from '@/app/utils/cookie';
import { useApiError, Http } from '../../utils/http';
import {
  InfoRequest,
  STATUS_BADGES,
  StatusBadge,
  normalizeStatus,
  formatDate,
  AdditionalInfoRequestsSection,
  OfferSection,
} from '@/app/components/portal/claim-shared';

export default function TrackClaim() {
  const router = useRouter();
  const { handleApiError } = useApiError();
  const [claimId, setClaimId] = useState('');
  const [claim, setClaim] = useState<ClaimData | null>(null);

  const [error, setError] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Fetch unanswered requests to determine if action buttons should be enabled
  const { data: allRequests } = useQuery({
    queryKey: ['all-requests', claimId],
    queryFn: async (): Promise<{ data?: InfoRequest[] }> => {
      return Http.get(`/claims/additional-information-requests/${claimId}`);
    },
    enabled: !!claimId && !!claim,
  });

  // Helper functions to check for unanswered requests
  const hasUnansweredDocumentRequest = () => {
    if (!allRequests?.data || !Array.isArray(allRequests.data)) return false;
    return allRequests.data.some((request: InfoRequest) =>
      request.request_type === 'document_request' &&
      request.status !== 'completed' &&
      request.status !== 'responded'
    );
  };

  const hasUnansweredAdditionalInfoRequest = () => {
    if (!allRequests?.data || !Array.isArray(allRequests.data)) return false;
    return allRequests.data.some((request: InfoRequest) =>
      request.request_type === 'additional_information' &&
      request.status !== 'completed' &&
      request.status !== 'responded'
    );
  };

  useEffect(() => {
    const token = cookie().getCookie('token');
    if (!token) {
      router.push('/portal');
    }
  }, [router]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSearching(true);
    try {
      const response = await trackClaim(claimId);
      setClaim(response.data);
    } catch (error) {
      const errorMessage = handleApiError(error, 'No claim found with this ID. Please check the ID and try again.');
      setError(errorMessage);
      setClaim(null);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Search Form */}
        <form onSubmit={handleSearch} className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="claimId" className="block text-sm font-medium text-gray-700 mb-1">
                Claim ID
              </label>
              <input
                type="text"
                id="claimId"
                value={claimId}
                onChange={(e) => setClaimId(e.target.value)}
                placeholder="Enter claim ID (e.g., CLM001)"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching || !claimId.trim()}
              className="self-end px-6 py-2 bg-[#004D40] text-white rounded-xl hover:bg-[#003D30] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSearching ? (
                'Searching...'
              ) : (
                <div className="flex items-center gap-2">
                  <MagnifyingGlassIcon className="w-5 h-5" />
                  Search
                </div>
              )}
            </button>
          </div>
          {error && (
            <div className="mt-4 flex items-center gap-2 text-red-600">
              <ExclamationCircleIcon className="w-5 h-5" />
              <p className="text-sm">{error}</p>
            </div>
          )}
        </form>

        {/* Claim Details */}
        {claim && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-900">{claim?.claim_number}</span>
                  <StatusBadge status={normalizeStatus(claim?.status)} />
                </div>
                <span className="text-gray-500 text-sm">
                  Last updated: {claim.submission_date ? formatDate(claim.submission_date) : formatDate(claim?.created_at)}
                </span>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-500">Type</span>
                  <p className="font-medium text-gray-900">{claim?.claim_type?.name || claim?.claim_type_details?.name}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Description</span>
                  <p className="text-gray-900">{claim?.description}</p>
                </div>
              </div>
            </div>

            {/* Required Documents Section */}
            {'requiredDocuments' in claim && (
              <div className="p-6 border-b">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Required Documents</h3>
                <div className="space-y-3">
                  {claim?.documents?.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DocumentTextIcon className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-700">{doc.document_type}</span>
                      </div>
                      <span className={`text-sm font-medium ${doc.status === 'UPLOADED' ? 'text-green-600' : 'text-orange-600'
                        }`}>
                        {doc.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Questions Section */}
            {
              claim?.questions && (
                <div>
                  {claim?.questions && (
                    <div className="p-6 border-b">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Questions</h3>
                      <div className="space-y-4">
                        {claim.questions.map((q) => (
                          <div key={q.id} className="bg-gray-50 rounded-lg p-4">
                            <p className="text-gray-800 mb-2">{q.question}</p>
                            <div className="flex items-center justify-between">
                              <span className={`text-sm font-medium ${q.status?.toString().toUpperCase() === 'ANSWERED' ? 'text-green-600' : 'text-orange-600'
                                }`}>
                                {q.status}
                              </span>
                              {q.status?.toString().toUpperCase() === 'PENDING' && (
                                <button
                                  onClick={() => router.push(`/portal/request-response?claimId=${claimId}&requestType=additional_information`)}
                                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                  <InformationCircleIcon className="h-4 w-4 mr-1" />
                                  Respond
                                  <ArrowRightIcon className="h-3 w-3 ml-1" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>)
            }

            {/* Action Buttons Section */}
            <div className="p-6 border-b bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Available Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Document Request Button */}
                <button
                  onClick={() => router.push(`/portal/request-response?claimId=${claimId}&requestType=document_request`)}
                  disabled={!hasUnansweredDocumentRequest()}
                  className={`flex items-center justify-between p-4 bg-white rounded-lg border transition-all group ${
                    hasUnansweredDocumentRequest()
                      ? 'border-gray-200 hover:border-blue-300 hover:shadow-sm cursor-pointer'
                      : 'border-gray-100 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center">
                    <DocumentTextIcon className={`h-6 w-6 mr-3 ${
                      hasUnansweredDocumentRequest() ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <div className="text-left">
                      <p className={`font-medium ${
                        hasUnansweredDocumentRequest() ? 'text-gray-900' : 'text-gray-500'
                      }`}>Document Request</p>
                      <p className="text-sm text-gray-500">
                        {hasUnansweredDocumentRequest()
                          ? 'Upload required documents'
                          : 'No pending requests'}
                      </p>
                    </div>
                  </div>
                  <ArrowRightIcon className={`h-5 w-5 transition-colors ${
                    hasUnansweredDocumentRequest()
                      ? 'text-gray-400 group-hover:text-blue-600'
                      : 'text-gray-300'
                  }`} />
                </button>

                {/* Additional Information Button */}
                <button
                  onClick={() => router.push(`/portal/request-response?claimId=${claimId}&requestType=additional_information`)}
                  disabled={!hasUnansweredAdditionalInfoRequest()}
                  className={`flex items-center justify-between p-4 bg-white rounded-lg border transition-all group ${
                    hasUnansweredAdditionalInfoRequest()
                      ? 'border-gray-200 hover:border-green-300 hover:shadow-sm cursor-pointer'
                      : 'border-gray-100 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center">
                    <InformationCircleIcon className={`h-6 w-6 mr-3 ${
                      hasUnansweredAdditionalInfoRequest() ? 'text-green-600' : 'text-gray-400'
                    }`} />
                    <div className="text-left">
                      <p className={`font-medium ${
                        hasUnansweredAdditionalInfoRequest() ? 'text-gray-900' : 'text-gray-500'
                      }`}>Additional Information</p>
                      <p className="text-sm text-gray-500">
                        {hasUnansweredAdditionalInfoRequest()
                          ? 'Provide additional details'
                          : 'No pending requests'}
                      </p>
                    </div>
                  </div>
                  <ArrowRightIcon className={`h-5 w-5 transition-colors ${
                    hasUnansweredAdditionalInfoRequest()
                      ? 'text-gray-400 group-hover:text-green-600'
                      : 'text-gray-300'
                  }`} />
                </button>
              </div>
            </div>


            {/* Additional Information Requests */}
            <AdditionalInfoRequestsSection claimId={claimId} />

            {/* Offer Section */}
            <OfferSection claimId={String(claim?.id || claim?.claim_number || claimId)} className="p-6 border-b" />

            {/* Support History */}
            <div className="p-6 mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Support History</h3>
              <div className="relative">
                <div className="absolute top-0 bottom-0 left-2 w-0.5 bg-gray-200"></div>
                {
                  claim.claim_history.length > 0 && (
                    <div className="space-y-6">
                      {claim?.claim_history
                        ?.filter(event => event.description && event.description.trim() !== '')
                        ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                        ?.map((event, index) => {
                          const badge = STATUS_BADGES[normalizeStatus(event.status)] || STATUS_BADGES.DEFAULT;
                          const eventMeta = event.meta as { request_id?: { details?: string } } | null;
                          return (
                            <div key={index} className="relative flex gap-4">
                              <div className={`w-4 h-4 rounded-full mt-1.5 ${badge.color} ring-4 ring-white`}></div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {event.description}
                                </p>
                                {eventMeta?.request_id?.details && String(eventMeta.request_id.details).trim() !== '' && (
                                  <p className="text-gray-600 text-sm mt-1">
                                    {eventMeta.request_id.details}
                                  </p>
                                )}
                                <p className="text-gray-500 text-sm mt-1">
                                  {formatDate(event.created_at)}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
