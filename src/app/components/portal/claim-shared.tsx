'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentTextIcon,
  PaperAirplaneIcon,
  QuestionMarkCircleIcon,
  ExclamationCircleIcon,
  PaperClipIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/app/context/ToastContext';
import { useApiError, Http } from '@/app/utils/http';
import { uploadDocument } from '@/app/services/public';
import { getClaimOffer } from '@/app/services/claims';
import { validateUploadFile } from '@/app/utils/security';

// API function for responding to information requests
export const respondToInformationRequest = async (payload: {
  claim_id: number | string;
  request_id: number;
  response?: string;
  file?: string;
  document_name?: string;
  document_type?: string;
  document_size?: string;
}) => {
  return Http.post('/claims/respond-information-requests', payload);
};

export interface InfoRequest {
  id: number;
  request_type: 'additional_information' | 'document_request';
  details: string;
  status: string;
  response?: string;
  created_at: string;
  updated_at?: string;
}

export type StatusType =
  | 'SUBMITTED'
  | 'DOCUMENTS_VERIFIED'
  | 'IN_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'PENDING_DOCUMENTS'
  | 'DOCUMENTS_REQUESTED'
  | 'DOCUMENT_REQUESTED'
  | 'PENDING_RESPONSE'
  | 'PENDING'
  | 'OFFER_ACCEPTED'
  | 'OFFER_PAID'
  | 'DEFAULT';

export const STATUS_BADGES = {
  SUBMITTED: { color: 'bg-blue-100 text-blue-800', icon: ClockIcon },
  DOCUMENTS_VERIFIED: { color: 'bg-purple-100 text-purple-800', icon: DocumentTextIcon },
  IN_REVIEW: { color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon },
  APPROVED: { color: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
  REJECTED: { color: 'bg-red-100 text-red-800', icon: XCircleIcon },
  PENDING_DOCUMENTS: { color: 'bg-orange-100 text-orange-800', icon: PaperClipIcon },
  DOCUMENTS_REQUESTED: { color: 'bg-orange-100 text-orange-800', icon: DocumentTextIcon },
  DOCUMENT_REQUESTED: { color: 'bg-orange-100 text-orange-800', icon: DocumentTextIcon },
  PENDING_RESPONSE: { color: 'bg-orange-100 text-orange-800', icon: ExclamationCircleIcon },
  PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon },
  OFFER_ACCEPTED: { color: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
  OFFER_PAID: { color: 'bg-emerald-100 text-emerald-800', icon: CheckCircleIcon },
  // Default fallback for any unknown status
  DEFAULT: { color: 'bg-gray-100 text-gray-800', icon: QuestionMarkCircleIcon },
};

// Helper function to normalize status
export const normalizeStatus = (status: string | undefined | null): StatusType => {
  if (!status) {
    return 'DEFAULT';
  }

  const statusStr = status.toString().trim();
  if (!statusStr) {
    return 'DEFAULT';
  }

  const statusMap: Record<string, StatusType> = {
    submitted: 'SUBMITTED',
    documents_verified: 'DOCUMENTS_VERIFIED',
    in_review: 'IN_REVIEW',
    approved: 'APPROVED',
    rejected: 'REJECTED',
    pending_documents: 'PENDING_DOCUMENTS',
    document_requested: 'DOCUMENT_REQUESTED',
    pending_response: 'PENDING_RESPONSE',
    documents_requested: 'DOCUMENTS_REQUESTED',
    client_accepted: 'OFFER_ACCEPTED',
    paid: 'OFFER_PAID',
    pending: 'PENDING',
    default: 'SUBMITTED',
    unknown: 'SUBMITTED',
  };

  const normalizedStatus = statusMap[statusStr.toLowerCase()];

  if (!normalizedStatus) {
    console.warn('normalizeStatus: Unknown status value:', statusStr);
    return 'SUBMITTED';
  }

  return normalizedStatus;
};

export const STATUS_DISPLAY_LABELS: Record<string, string> = {
  SUBMITTED: 'Support Request Received',
  IN_REVIEW: 'Documentation Review in Progress',
  PENDING_DOCUMENTS: 'Awaiting Supporting Documents',
  DOCUMENTS_REQUESTED: 'Awaiting Supporting Documents',
  DOCUMENT_REQUESTED: 'Awaiting Supporting Documents',
  PENDING_RESPONSE: 'Client Action Needed',
  PENDING: 'Client Action Needed',
  OFFER_ACCEPTED: 'Client-Authorised Communication Sent',
  OFFER_PAID: 'Awaiting Insurer or Relevant-Party Update',
  APPROVED: 'Documentation Review Completed',
  DOCUMENTS_VERIFIED: 'Documentation Review Completed',
  REJECTED: 'Support File Closed',
  DEFAULT: 'Support Request Received',
};

export const StatusBadge = ({ status }: { status: StatusType }) => {
  const statusConfig = STATUS_BADGES[status] || STATUS_BADGES.DEFAULT;
  const StatusIcon = statusConfig?.icon || QuestionMarkCircleIcon;

  const getStatusText = () => {
    return STATUS_DISPLAY_LABELS[status] || (status ? status.replace(/_/g, ' ') : 'Unknown');
  };

  return (
    <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5 ${statusConfig?.color || 'bg-gray-100 text-gray-800'}`}>
      <StatusIcon className="w-4 h-4" />
      {getStatusText()}
    </div>
  );
};

// Date formatting function
export const formatDate = (dateString: string) => {
  if (!dateString) {
    return 'No date';
  }

  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }

  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleDateString('en-GB', { month: 'short' });
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const hoursStr = hours.toString().padStart(2, '0');

  return `${day} ${month} ${year} ${hoursStr}:${minutes} ${ampm}`;
};

interface InfoRequestsResponse {
  data?: InfoRequest[];
}

// Component for displaying additional information requests from dedicated endpoint
export const AdditionalInfoRequestsSection = ({ claimId }: { claimId: string }) => {
  const [showResponse, setShowResponse] = useState(false);
  const [response, setResponse] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<InfoRequest | null>(null);
  const { showToast } = useToast();
  const { handleApiError } = useApiError();

  // Fetch all requests with single API call
  const { data: allRequests, isLoading: isLoadingRequests, refetch: refetchRequests } = useQuery({
    queryKey: ['all-requests', claimId],
    queryFn: async (): Promise<InfoRequestsResponse> => {
      return Http.get(`/claims/additional-information-requests/${claimId}`);
    },
    enabled: !!claimId,
  });

  const handleSubmit = async () => {
    if (!selectedRequest) return;

    setIsSubmitting(true);
    try {
      const payload: Parameters<typeof respondToInformationRequest>[0] = {
        claim_id: claimId,
        request_id: selectedRequest.id,
      };

      if (selectedRequest.request_type === 'additional_information') {
        if (!response.trim()) {
          showToast('Please provide a response', 'error');
          return;
        }
        payload.response = response;
      } else if (selectedRequest.request_type === 'document_request') {
        if (!selectedFile) {
          showToast('Please select a file to upload', 'error');
          return;
        }

        const fileValidation = validateUploadFile(selectedFile);
        if (!fileValidation.isValid) {
          showToast(fileValidation.message, 'error');
          return;
        }

        // Upload file first
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
          const uploadResponse = await uploadDocument(formData);

          const fileUrl = uploadResponse.data?.image_url || uploadResponse.data?.file_url || uploadResponse.data?.url;

          if (!fileUrl) {
            showToast('File upload failed - no URL returned', 'error');
            return;
          }

          payload.file = fileUrl;
          payload.document_name = selectedFile.name.split('.')[0];
          payload.document_type = selectedFile.type;
          payload.document_size = (selectedFile.size / (1024 * 1024)).toFixed(2);
        } catch (uploadError) {
          const errorMessage = uploadError instanceof Error ? uploadError.message : 'Unknown error';
          showToast('File upload failed: ' + errorMessage, 'error');
          return;
        }
      }

      await respondToInformationRequest(payload);

      // Always refresh the requests after successful submission
      await refetchRequests();

      showToast('Response submitted successfully!', 'success');
      setShowResponse(false);
      setSelectedRequest(null);

      // Clear the appropriate fields based on request type
      if (selectedRequest.request_type === 'additional_information') {
        setResponse('');
      } else if (selectedRequest.request_type === 'document_request') {
        setSelectedFile(null);
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      showToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowResponse(false);
    setSelectedRequest(null);
    if (selectedRequest?.request_type === 'additional_information') {
      setResponse('');
    } else if (selectedRequest?.request_type === 'document_request') {
      setSelectedFile(null);
    }
  };

  const requests: InfoRequest[] = [];

  // Process all requests from single API call
  if (allRequests?.data && Array.isArray(allRequests.data)) {
    allRequests.data.forEach((request: InfoRequest) => {
      if (request.status !== 'completed' && request.status !== 'responded') {
        requests.push(request);
      }
    });

    // Sort by updated_at field (newest first)
    requests.sort((a, b) => {
      const dateA = a.updated_at ? new Date(a.updated_at).getTime() : 0;
      const dateB = b.updated_at ? new Date(b.updated_at).getTime() : 0;
      return dateB - dateA;
    });
  }

  if (isLoadingRequests) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information Requests</h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading requests...</span>
        </div>
      </div>
    );
  }

  if (requests.length === 0) {
    return null; // No pending requests
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information Requests</h3>

      {requests.map((request) => (
        <div key={request.id} className="border border-gray-200 rounded-lg p-4 mb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900">
                {request.request_type === 'additional_information' ? 'Information Request' : 'Document Request'}
              </h4>
              <h5 className="text-sm font-medium text-gray-700 mt-1">
                {request.details || 'No details provided'}
              </h5>
              <div className="mt-1 space-y-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  request.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : request.status === 'overdue'
                    ? 'bg-red-100 text-red-800'
                    : request.status === 'responded'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {request.status?.charAt(0).toUpperCase() + request.status?.slice(1)}
                </span>
                <p className="text-sm text-gray-600">
                  {request.response || 'No response provided'}
                </p>
                <p className="text-sm text-gray-500">
                  Created: {formatDate(request.created_at)}
                </p>
                {request.updated_at && (
                  <p className="text-sm text-gray-500">
                    Updated: {formatDate(request.updated_at)}
                  </p>
                )}
              </div>
            </div>

            {!showResponse && (
              <button
                onClick={() => {
                  setSelectedRequest(request);
                  setShowResponse(true);
                }}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PaperAirplaneIcon className="h-4 w-4 mr-1" />
                Respond
              </button>
            )}
          </div>

          {showResponse && selectedRequest?.id === request.id && (
            <div className="bg-gray-50 rounded-lg p-4 mt-4">
              <h5 className="text-sm font-medium text-gray-900 mb-3">
                Respond to {request.request_type === 'additional_information' ? 'Information Request' : 'Document Request'}
              </h5>

              {request.request_type === 'additional_information' ? (
                <div>
                  <label htmlFor={`info-request-response-${request.id}`} className="sr-only">
                    Your response
                  </label>
                  <textarea
                    id={`info-request-response-${request.id}`}
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    placeholder="Enter your response..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              ) : (
                <div>
                  <label htmlFor={`info-request-file-${request.id}`} className="sr-only">
                    Document to upload
                  </label>
                  <input
                    id={`info-request-file-${request.id}`}
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      if (file) {
                        const validation = validateUploadFile(file);
                        if (!validation.isValid) {
                          showToast(validation.message, 'error');
                          e.target.value = '';
                          return;
                        }
                      }
                      setSelectedFile(file);
                    }}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                  {selectedFile && (
                    <p className="text-xs text-gray-600 mt-1">
                      Selected: {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                    </p>
                  )}
                </div>
              )}

              <div className="flex justify-end space-x-2 mt-3">
                <button
                  onClick={handleCancel}
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Response'}
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Component for displaying offers
export const OfferSection = ({ claimId, className = 'mt-6 mb-6' }: { claimId: string; className?: string }) => {
  const router = useRouter();

  // Fetch offer for this claim
  const { data: offerData, isLoading: isLoadingOffer, error: offerError } = useQuery({
    queryKey: ['claim-offer', claimId],
    queryFn: () => getClaimOffer(claimId),
    enabled: !!claimId,
    retry: 1,
  });

  // Handle errors silently for 404 (no offer exists yet)
  useEffect(() => {
    if (offerError && (offerError as { response?: { status?: number } })?.response?.status !== 404) {
      console.error('Error fetching offer:', offerError);
    }
  }, [offerError]);

  const offer = offerData?.data;

  if (isLoadingOffer) {
    return null; // Don't show loading state, just hide the section
  }

  if (!offer) {
    return null; // No offer available
  }

  const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(numAmount)) return '₦0';
    return `₦${numAmount.toLocaleString('en-NG', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  };

  const isOfferExpired = () => {
    if (offer.expired !== undefined) {
      return offer.expired;
    }
    if (!offer.expiry_period) return false;
    return new Date(offer.expiry_period) < new Date();
  };

  const getOfferStatus = () => {
    return offer.status || 'pending';
  };

  const getOfferStatusColor = () => {
    const statusLower = getOfferStatus().toLowerCase();
    if (statusLower === 'accepted' || statusLower === 'client_accepted') return 'bg-green-50 border-green-200';
    if (statusLower === 'rejected') return 'bg-red-50 border-red-200';
    if (statusLower === 'expired' || isOfferExpired()) return 'bg-gray-50 border-gray-200';
    if (statusLower === 'paid') return 'bg-emerald-50 border-emerald-200';
    return 'bg-blue-50 border-blue-200';
  };

  const getOfferStatusText = () => {
    const status = getOfferStatus();
    const statusLower = status.toLowerCase();
    if (statusLower === 'client_accepted') return 'Accepted';
    if (statusLower === 'settlement_approved') return 'Pending';
    if (statusLower === 'paid') return 'Paid';
    return status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ');
  };

  return (
    <div className={className}>
      <div className={`border rounded-lg p-4 ${getOfferStatusColor()}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 flex items-center justify-center text-[#004D40] font-bold text-lg">₦</div>
            <div>
              <h3 className="font-semibold text-gray-900">Insurer Offer Received</h3>
              <p className="text-sm text-gray-600">
                Amount: <span className="font-medium">{formatCurrency(offer.offer_amount)}</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Status: <span className="font-medium">{getOfferStatusText()}</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => router.push(`/portal/offer?claimId=${claimId}`)}
            className="flex items-center gap-2 px-4 py-2 bg-[#004D40] text-white rounded-lg hover:bg-[#003D30] transition-colors text-sm font-medium"
          >
            View Offer
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
