'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  MagnifyingGlassIcon,
  ExclamationCircleIcon,
  DocumentTextIcon,
  PaperClipIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightIcon,
  InformationCircleIcon,
  PaperAirplaneIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import { trackClaim, ClaimData } from '@/app/services/dashboard';
import { uploadDocument } from '@/app/services/public';
import { getAdditionalInfoRequest, checkRequestStatus, getClaimOffer } from '@/app/services/claims';
import cookie from '@/app/utils/cookie';
import { useToast } from '../../context/ToastContext';
import { useApiError, Http } from '../../utils/http';

// API function for responding to information requests
const respondToInformationRequest = async (payload: {
  claim_id: number;
  request_id: number;
  response?: string;
  file?: string;
  document_name?: string;
  document_type?: string;
  document_size?: string;
}) => {
  return Http.post('/claims/respond-information-requests', payload);
};

// Using the same types from dashboard
type StatusType = 'SUBMITTED' | 'DOCUMENTS_VERIFIED' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'PENDING_DOCUMENTS' | 'DOCUMENTS_REQUESTED' | 'PENDING_RESPONSE';

interface Document {
  name: string;
  status: 'PENDING' | 'UPLOADED';
}

interface Question {
  id: number;
  question: string;
  status: 'PENDING' | 'ANSWERED';
}

interface InfoRequest {
  id: number;
  request_type: 'additional_information' | 'document_request';
  details: string;
  status: string;
  response?: string;
  created_at: string;
  updated_at?: string;
}

interface BaseClaimType {
  id: string;
  type: 'MOTOR' | 'GADGET' | 'PROPERTY' | 'BUSINESS';
  status: StatusType;
  submittedAt: string;
  updatedAt: string;
  description: string;
  amount: number;
  history: Array<{
    date: string;
    status: StatusType;
    note: string;
  }>;
}

interface DocumentClaim extends BaseClaimType {
  requiredDocuments: Document[];
}

interface QuestionClaim extends BaseClaimType {
  questions: Question[];
}

type Claim = BaseClaimType | DocumentClaim | QuestionClaim;

// Mock data - In a real app, this would be an API call
const MOCK_CLAIMS: { [key: string]: Claim } = {
  'CLM001': {
    id: 'CLM001',
    type: 'MOTOR',
    status: 'IN_REVIEW',
    submittedAt: '2024-03-15T10:30:00Z',
    updatedAt: '2024-03-16T14:20:00Z',
    description: 'Vehicle damage from accident',
    amount: 250000,
    history: [
      { date: '2024-03-15T10:30:00Z', status: 'SUBMITTED', note: 'Claim submitted successfully' },
      { date: '2024-03-15T15:45:00Z', status: 'DOCUMENTS_VERIFIED', note: 'All required documents verified' },
      { date: '2024-03-16T14:20:00Z', status: 'IN_REVIEW', note: 'Claim under review by claims adjuster' },
    ],
  },
  'CLM003': {
    id: 'CLM003',
    type: 'PROPERTY',
    status: 'PENDING_DOCUMENTS',
    submittedAt: '2024-03-18T09:30:00Z',
    updatedAt: '2024-03-18T14:20:00Z',
    description: 'Water damage to living room',
    amount: 750000,
    requiredDocuments: [
      { name: 'Property Photos', status: 'PENDING' },
      { name: 'Repair Estimates', status: 'PENDING' },
      { name: 'Police Report', status: 'UPLOADED' },
    ],
    history: [
      { date: '2024-03-18T09:30:00Z', status: 'SUBMITTED', note: 'Claim submitted successfully' },
      { date: '2024-03-18T10:45:00Z', status: 'DOCUMENTS_REQUESTED', note: 'Additional documents required: Property Photos, Repair Estimates' },
      { date: '2024-03-18T14:20:00Z', status: 'PENDING_DOCUMENTS', note: 'Awaiting document upload from claimant' },
    ],
  },
};

const STATUS_BADGES = {
  SUBMITTED: { color: 'bg-blue-100 text-blue-800', icon: ClockIcon },
  DOCUMENTS_VERIFIED: { color: 'bg-purple-100 text-purple-800', icon: DocumentTextIcon },
  IN_REVIEW: { color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon },
  APPROVED: { color: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
  REJECTED: { color: 'bg-red-100 text-red-800', icon: XCircleIcon },
  PENDING_DOCUMENTS: { color: 'bg-orange-100 text-orange-800', icon: PaperClipIcon },
  DOCUMENTS_REQUESTED: { color: 'bg-orange-100 text-orange-800', icon: DocumentTextIcon },
  PENDING_RESPONSE: { color: 'bg-orange-100 text-orange-800', icon: ExclamationCircleIcon },
};

// Utility function to format dates
const formatDate = (dateString: string) => {
  if (!dateString) {
    console.log('formatDate: dateString is null/undefined:', dateString);
    return 'No date';
  }
  
  console.log('formatDate: input dateString:', dateString);
  
  const date = new Date(dateString);
  console.log('formatDate: parsed date:', date);
  
  if (isNaN(date.getTime())) {
    console.log('formatDate: Invalid date detected');
    return 'Invalid date';
  }
  
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleDateString('en-GB', { month: 'short' });
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const hoursStr = hours.toString().padStart(2, '0');
  
  const result = `${day} ${month} ${year} ${hoursStr}:${minutes} ${ampm}`;
  console.log('formatDate: result:', result);
  return result;
};

const StatusBadge = ({ status }: { status: StatusType }) => {
  const StatusIcon = STATUS_BADGES[status].icon;
  return (
    <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5 ${STATUS_BADGES[status].color}`}>
      <StatusIcon className="w-4 h-4" />
      {status ? status.replace('_', ' ') : 'Unknown'}
    </div>
  );
};

// Component for displaying additional information requests from dedicated endpoint
const AdditionalInfoRequestsSection = ({ claimId }: { claimId: string }) => {
  const [showResponse, setShowResponse] = useState(false);
  const [response, setResponse] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const { showToast } = useToast();
  const { handleApiError } = useApiError();

  // Fetch all requests with single API call
  const { data: allRequests, isLoading: isLoadingRequests, refetch: refetchRequests } = useQuery({
    queryKey: ['all-requests', claimId],
    queryFn: async () => {
      console.log('=== MAKING SINGLE API CALL ===');
      console.log('Claim ID:', claimId);
      const result = await Http.get(`/claims/additional-information-requests/${claimId}`);
      console.log('All Requests API Call Result:', result);
      return result;
    },
    enabled: !!claimId,
  });

  const handleSubmit = async () => {
    if (!selectedRequest) return;

    setIsSubmitting(true);
    try {
      const payload: any = {
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

        // Upload file first
        const formData = new FormData();
        formData.append('file', selectedFile);
        const uploadResponse = await uploadDocument(formData);
        const fileUrl = uploadResponse.data?.image_url || uploadResponse.data?.file_url;

        if (!fileUrl) {
          showToast('File upload failed', 'error');
          return;
        }

        payload.file = fileUrl;
        payload.document_name = selectedFile.name.split('.')[0];
        payload.document_type = selectedFile.type;
        payload.document_size = (selectedFile.size / (1024 * 1024)).toFixed(2);
      }

      const apiResponse = await respondToInformationRequest(payload);
      
      // Always refresh the requests after successful submission
      console.log('Response successful, refreshing requests...');
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
        requests.push(request); // Keep the original request_type from API
      }
    });
    
    // Sort by updated_at field (newest first)
    requests.sort((a, b) => {
      const dateA = a.updated_at ? new Date(a.updated_at).getTime() : 0;
      const dateB = b.updated_at ? new Date(b.updated_at).getTime() : 0;
      return dateB - dateA;
    });
  }

  // Debug: Log the API response fields
  console.log('=== API RESPONSE DEBUG ===');
  console.log('All Requests Count:', allRequests?.data?.length || 0);
  console.log('Total Processed requests:', requests.length);
  console.log('All Requests:', allRequests?.data);
  console.log('Final Processed requests:', requests);
  console.log('=== API ENDPOINT CHECK ===');
  console.log('API Endpoint used:', `/claims/additional-information-requests/${claimId}`);


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
                  <textarea
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    placeholder="Enter your response..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              ) : (
                <div>
                  <input
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
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
const OfferSection = ({ claimId, claimNumber }: { claimId: string; claimNumber: string }) => {
  const router = useRouter();
  const { showToast } = useToast();
  const { handleApiError } = useApiError();

  // Fetch offer for this claim
  const { data: offerData, isLoading: isLoadingOffer, error: offerError } = useQuery({
    queryKey: ['claim-offer', claimId],
    queryFn: () => getClaimOffer(claimId),
    enabled: !!claimId,
    retry: 1,
  });

  // Handle errors silently for 404 (no offer exists yet)
  useEffect(() => {
    if (offerError && (offerError as any)?.response?.status !== 404) {
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
    if (offer.offer_acceptance_status === 'accepted') return 'accepted';
    if (offer.offer_acceptance_status === 'rejected') return 'rejected';
    if (offer.status === 'client_accepted') return 'accepted';
    if (isOfferExpired()) return 'expired';
    if (offer.status === 'settlement_approved') return 'pending';
    return 'pending';
  };

  const getOfferStatusColor = () => {
    const status = getOfferStatus();
    if (status === 'accepted') return 'bg-green-50 border-green-200';
    if (status === 'rejected') return 'bg-red-50 border-red-200';
    if (status === 'expired') return 'bg-gray-50 border-gray-200';
    return 'bg-blue-50 border-blue-200';
  };

  const getOfferStatusText = () => {
    const status = getOfferStatus();
    if (status === 'accepted') return 'Accepted';
    if (status === 'rejected') return 'Rejected';
    if (status === 'expired') return 'Expired';
    return 'Pending';
  };

  return (
    <div className="p-6 border-b">
      <div className={`border rounded-lg p-4 ${getOfferStatusColor()}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CurrencyDollarIcon className="h-6 w-6 text-[#004D40]" />
            <div>
              <h3 className="font-semibold text-gray-900">Settlement Offer</h3>
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

// Component for handling request responses
const RequestResponseComponent = ({ 
  event, 
  claimId, 
  onResponseSent 
}: { 
  event: any; 
  claimId: string; 
  onResponseSent: () => void; 
}) => {
  
  const [showResponse, setShowResponse] = useState(false);
  const [response, setResponse] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();
  const { handleApiError } = useApiError();

  const requestId = event.meta?.request_id?.id;
  const requestType = event.meta?.request_id?.request_type || event.meta?.request_type;

  // Check request status from API
  const { data: requestStatus, isLoading: isLoadingStatus } = useQuery({
    queryKey: ['request-status', claimId, requestType],
    queryFn: () => checkRequestStatus(claimId, requestType),
    enabled: !!requestId && !!requestType,
    staleTime: 30000, // 30 seconds
  });

  const isRequestCompleted = requestStatus?.data?.status === 'completed';
  

  const handleSubmit = async () => {
    if (!requestId || !requestType) return;

    setIsSubmitting(true);
    try {
      const payload: any = {
        claim_id: claimId,
        request_id: requestId,
      };

      if (requestType === 'additional_information') {
        if (!response.trim()) {
          showToast('Please provide a response', 'error');
          return;
        }
        payload.response = response;
      } else if (requestType === 'document_request') {
        if (!selectedFile) {
          showToast('Please select a file to upload', 'error');
          return;
        }

        // Upload file first
        const formData = new FormData();
        formData.append('file', selectedFile);
        const uploadResponse = await uploadDocument(formData);
        const fileUrl = uploadResponse.data?.image_url || uploadResponse.data?.file_url;

        if (!fileUrl) {
          showToast('File upload failed', 'error');
          return;
        }

        payload.file = fileUrl;
        payload.document_name = selectedFile.name.split('.')[0];
        payload.document_type = selectedFile.type;
        payload.document_size = (selectedFile.size / (1024 * 1024)).toFixed(2); // Convert to MB
      }

      await respondToInformationRequest(payload);
      showToast('Response submitted successfully!', 'success');
      setShowResponse(false);
      
      // Clear the appropriate fields based on request type
      if (requestType === 'additional_information') {
        setResponse('');
      } else if (requestType === 'document_request') {
        setSelectedFile(null);
      }
      
      onResponseSent();
    } catch (error) {
      const errorMessage = handleApiError(error);
      showToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!requestId || !requestType) return null;

  // Show loading state while checking status
  if (isLoadingStatus) {
    return (
      <div className="mt-3">
        <div className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-gray-700 bg-gray-100">
          <svg className="animate-spin h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Checking Status...
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3">
      {isRequestCompleted ? (
        <div className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-green-700 bg-green-100">
          <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Response Submitted
        </div>
      ) : !showResponse ? (
        <button
          onClick={() => setShowResponse(true)}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PaperAirplaneIcon className="h-4 w-4 mr-1" />
          Respond to Request
        </button>
      ) : (
        <div className="bg-gray-50 rounded-lg p-4 mt-2">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Respond to {requestType === 'additional_information' ? 'Information Request' : 'Document Request'}
          </h4>
          <p className="text-xs text-gray-500 mb-2">Debug: requestType = "{requestType}"</p>
          
          {requestType === 'additional_information' ? (
            <div>
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Enter your response..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          ) : (
            <div>
              <input
                type="file"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
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
              onClick={() => {
                setShowResponse(false);
                // Clear the appropriate fields based on request type
                if (requestType === 'additional_information') {
                  setResponse('');
                } else if (requestType === 'document_request') {
                  setSelectedFile(null);
                }
              }}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <PaperAirplaneIcon className="h-3 w-3 mr-1" />
                  Submit
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default function TrackClaim() {
  const router = useRouter();
  const { showToast } = useToast();
  const { handleApiError } = useApiError();
  const [claimId, setClaimId] = useState('');
  const [claim, setClaim] = useState<ClaimData | null>(null);
  // const [claim, setClaim] = useState<ClaimData[]>([]);

  const [error, setError] = useState('');
  const [isSearching, setIsSearching] = useState(false);

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
      console.log(response?.data, 'response_____');
      setClaim(response.data);
      // Simulate API call delay
      // setTimeout(() => {
      //   const formattedClaimId = claimId.trim().toUpperCase();
      //   const foundClaim = MOCK_CLAIMS[formattedClaimId];

      //   if (foundClaim) {
      //     setClaim(foundClaim);
      //   } else {
      //     setError('No claim found with this ID. Please check the ID and try again.');
      //     setClaim(null);
      //   }
      //   setIsSearching(false);
      // }, 1000);
    } catch (error: any) {
      const errorMessage = handleApiError(error, 'No claim found with this ID. Please check the ID and try again.');
      setError(errorMessage);
      setClaim(null);
      console.log(error, 'error_____');
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
                  <StatusBadge status={claim?.status?.toString().toUpperCase() as StatusType} />
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
                {/* <div>
                  <span className="text-sm text-gray-500">Amount</span>
                  <p className="font-medium text-gray-900">₦{claim?.amount.toLocaleString()}</p>
                </div> */}
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
                  className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-center">
                    <DocumentTextIcon className="h-6 w-6 text-blue-600 mr-3" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Document Request</p>
                      <p className="text-sm text-gray-500">Upload required documents</p>
                    </div>
                  </div>
                  <ArrowRightIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </button>

                {/* Additional Information Button */}
                <button
                  onClick={() => router.push(`/portal/request-response?claimId=${claimId}&requestType=additional_information`)}
                  className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-center">
                    <InformationCircleIcon className="h-6 w-6 text-green-600 mr-3" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Additional Information</p>
                      <p className="text-sm text-gray-500">Provide additional details</p>
                    </div>
                  </div>
                  <ArrowRightIcon className="h-5 w-5 text-gray-400 group-hover:text-green-600 transition-colors" />
                </button>
              </div>
            </div>


            {/* Additional Information Requests */}
            <AdditionalInfoRequestsSection claimId={claimId} />

            {/* Offer Section */}
            <OfferSection claimId={String(claim?.id || claim?.claim_number || claimId)} claimNumber={claim?.claim_number || claimId} />

            {/* Claim History */}
            <div className="p-6 mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Claim History</h3>
              <div className="relative">
                <div className="absolute top-0 bottom-0 left-2 w-0.5 bg-gray-200"></div>
                {
                  claim.claim_history.length > 0 && (
                    <div className="space-y-6">
                      {claim?.claim_history
                        ?.filter(event => event.description && event.description.trim() !== '') // Skip items with no details
                        ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) // Sort newest first
                        ?.map((event, index) => (
                        <div key={index} className="relative flex gap-4">
                          <div className={`w-4 h-4 rounded-full mt-1.5 ${STATUS_BADGES[event.status?.toString().toUpperCase() as StatusType].color} ring-4 ring-white`}></div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {event.description}
                            </p>
                            {event.meta && (event.meta as any).request_id && (event.meta as any).request_id.details && String((event.meta as any).request_id.details).trim() !== '' && (
                              <p className="text-gray-600 text-sm mt-1">
                                {(event.meta as any).request_id.details}
                              </p>
                            )}
                            <p className="text-gray-500 text-sm mt-1">
                              {formatDate(event.created_at)}
                            </p>
                            
                          </div>
                        </div>
                      ))}
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