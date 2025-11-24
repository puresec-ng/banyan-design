'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  EnvelopeIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  ChevronRightIcon,
  UserCircleIcon,
  PlusCircleIcon,
  ClipboardDocumentListIcon,
  ArrowLeftOnRectangleIcon,
  PaperAirplaneIcon,
  ArrowUpTrayIcon,
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
  QuestionMarkCircleIcon,
  ExclamationCircleIcon,
  PaperClipIcon,
  CurrencyDollarIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { getSubmitedClaims, ClaimData, uploadClaimDocument } from '../../services/dashboard';
import { uploadDocument } from '../../services/public';
import { getAdditionalInfoRequest, checkRequestStatus, getClaimOffer } from '../../services/claims';
import { useApiError, Http } from '../../utils/http';

import { useQuery } from "@tanstack/react-query";
import { useToast } from '@/app/context/ToastContext';
import cookie from '@/app/utils/cookie';

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

// Add these type definitions after the imports and before MOCK_CLAIMS
interface UploadDocumentResponse {
  image_url: string;
}

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

const responseDataSample = {
  "data": {
    "data": [

      {
        "claim_number": "MTR-2025-00006",
        "incident_location": "IDOW",
        "incident_date": "2025-05-29 20:12:00",
        "description": "IDOW",
        "status": "submitted",
        "claim_history": [
          {
            "id": 1,
            "claim_id": 6,
            "description": "Claim submitted successfully",
            "status": "submitted",
            "meta": null,
            "created_at": "2025-05-14T14:13:18.000000Z",
            "updated_at": "2025-05-14T14:13:18.000000Z"
          }
        ],
        "documents": []
      }
    ],
    "links": {
      "first": "https:\/\/api.banyanclaims.com\/api\/v1\/claims?page=1",
      "last": "https:\/\/api.banyanclaims.com\/api\/v1\/claims?page=1",
      "prev": null,
      "next": null
    },
    "meta": {
      "current_page": 1,
      "from": 1,
      "last_page": 1,
      "links": [
        {
          "url": null,
          "label": "&laquo; Previous",
          "active": false
        },
        {
          "url": "https:\/\/api.banyanclaims.com\/api\/v1\/claims?page=1",
          "label": "1",
          "active": true
        },
        {
          "url": null,
          "label": "Next &raquo;",
          "active": false
        }
      ],
      "path": "https:\/\/api.banyanclaims.com\/api\/v1\/claims",
      "per_page": 15,
      "to": 2,
      "total": 2
    }
  }
}

interface DocumentClaim extends BaseClaimType {
  requiredDocuments: Document[];
}

interface QuestionClaim extends BaseClaimType {
  questions: Question[];
}

type Claim = BaseClaimType | DocumentClaim | QuestionClaim;

// Mock data - In a real app, this would come from an API
const MOCK_CLAIMS: Claim[] = [
  {
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
  {
    id: 'CLM004',
    type: 'BUSINESS',
    status: 'PENDING_RESPONSE',
    submittedAt: '2024-03-17T11:20:00Z',
    updatedAt: '2024-03-18T15:30:00Z',
    description: 'Business interruption claim',
    amount: 1500000,
    questions: [
      {
        id: 1,
        question: 'Please provide the exact dates of business interruption.',
        status: 'PENDING',
      },
      {
        id: 2,
        question: 'What was your average daily revenue for the 3 months prior to the incident?',
        status: 'PENDING',
      },
      {
        id: 3,
        question: 'Have you implemented any mitigation measures during the interruption period?',
        status: 'PENDING',
      },
    ],
    history: [
      { date: '2024-03-17T11:20:00Z', status: 'SUBMITTED', note: 'Claim submitted successfully' },
      { date: '2024-03-18T09:15:00Z', status: 'IN_REVIEW', note: 'Claim under review by claims adjuster' },
      { date: '2024-03-18T15:30:00Z', status: 'PENDING_RESPONSE', note: 'Additional information requested from claimant' },
    ],
  },
  {
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
  {
    id: 'CLM002',
    type: 'GADGET',
    status: 'APPROVED',
    submittedAt: '2024-03-10T09:15:00Z',
    updatedAt: '2024-03-14T16:30:00Z',
    description: 'iPhone screen damage',
    amount: 45000,
    history: [
      { date: '2024-03-10T09:15:00Z', status: 'SUBMITTED', note: 'Claim submitted successfully' },
      { date: '2024-03-11T11:20:00Z', status: 'DOCUMENTS_VERIFIED', note: 'All required documents verified' },
      { date: '2024-03-12T14:30:00Z', status: 'IN_REVIEW', note: 'Claim under review by claims adjuster' },
      { date: '2024-03-14T16:30:00Z', status: 'APPROVED', note: 'Claim approved for payment' },
    ],
  },
];

type StatusType = 'SUBMITTED' | 'DOCUMENTS_VERIFIED' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'PENDING_DOCUMENTS' | 'DOCUMENTS_REQUESTED' | 'DOCUMENT_REQUESTED' | 'PENDING_RESPONSE' | 'PENDING' | 'OFFER_ACCEPTED' | 'OFFER_PAID' | 'DEFAULT';

const STATUS_BADGES = {
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
const normalizeStatus = (status: string | undefined | null): StatusType => {
  if (!status) {
    console.warn('normalizeStatus: status is null/undefined');
    return 'DEFAULT';
  }
  
  const statusStr = status.toString().trim();
  if (!statusStr) {
    console.warn('normalizeStatus: status is empty string');
    return 'DEFAULT';
  }
  
  const statusMap: Record<string, StatusType> = {
    'submitted': 'SUBMITTED',
    'documents_verified': 'DOCUMENTS_VERIFIED', 
    'in_review': 'IN_REVIEW',
    'approved': 'APPROVED',
    'rejected': 'REJECTED',
    'pending_documents': 'PENDING_DOCUMENTS',
    'document_requested': 'DOCUMENT_REQUESTED',
    'pending_response': 'PENDING_RESPONSE',
    'documents_requested': 'DOCUMENTS_REQUESTED',
    'client_accepted': 'OFFER_ACCEPTED', // Map 'client_accepted' to 'OFFER_ACCEPTED' status
    'paid': 'OFFER_PAID', // Map 'paid' to 'OFFER_PAID' status
    'pending': 'PENDING', // Map 'pending' to 'PENDING' status
    'default': 'SUBMITTED', // Map 'default' to 'SUBMITTED' status
    'unknown': 'SUBMITTED', // Map 'unknown' to 'SUBMITTED' status
    // Handle any uppercase versions that might come through
    'SUBMITTED': 'SUBMITTED',
    'DOCUMENTS_VERIFIED': 'DOCUMENTS_VERIFIED',
    'IN_REVIEW': 'IN_REVIEW', 
    'APPROVED': 'APPROVED',
    'REJECTED': 'REJECTED',
    'PENDING_DOCUMENTS': 'PENDING_DOCUMENTS',
    'DOCUMENT_REQUESTED': 'DOCUMENT_REQUESTED',
    'PENDING_RESPONSE': 'PENDING_RESPONSE',
    'DOCUMENTS_REQUESTED': 'DOCUMENTS_REQUESTED',
    'CLIENT_ACCEPTED': 'OFFER_ACCEPTED', // Map 'CLIENT_ACCEPTED' to 'OFFER_ACCEPTED' status
    'PAID': 'OFFER_PAID', // Map 'PAID' to 'OFFER_PAID' status
    'PENDING': 'PENDING', // Map 'PENDING' to 'PENDING' status
    'DEFAULT': 'SUBMITTED', // Map 'DEFAULT' to 'SUBMITTED' status
    'UNKNOWN': 'SUBMITTED', // Map 'UNKNOWN' to 'SUBMITTED' status
  };
  
  const lowerStatus = statusStr.toLowerCase();
  const upperStatus = statusStr.toUpperCase();
  const normalizedStatus = statusMap[lowerStatus] || statusMap[upperStatus];
  
  if (!normalizedStatus) {
    console.warn('normalizeStatus: Unknown status value:', statusStr, '| Original:', status);
    return 'SUBMITTED'; // Default to SUBMITTED instead of DEFAULT
  }
  
  return normalizedStatus;
};

const StatusBadge = ({ status }: { status: StatusType }) => {
  const statusConfig = STATUS_BADGES[status] || STATUS_BADGES.DEFAULT;
  const StatusIcon = statusConfig?.icon || QuestionMarkCircleIcon;
  
  // Format status text for display
  const getStatusText = () => {
    if (status === 'OFFER_ACCEPTED') return 'OFFER ACCEPTED';
    if (status === 'OFFER_PAID') return 'OFFER PAID';
    return status ? status.replace(/_/g, ' ') : 'Unknown';
  };
  
  return (
    <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5 ${statusConfig?.color || 'bg-gray-100 text-gray-800'}`}>
      <StatusIcon className="w-4 h-4" />
      {getStatusText()}
    </div>
  );
};

// Mock user data - In a real app, this would come from your auth system
const MOCK_USER = {
  name: 'John Doe',
  email: 'john@example.com',
  avatar: null,
};

// Date formatting function
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
        
        console.log('=== FILE UPLOAD DEBUG ===');
        console.log('Selected file:', selectedFile);
        console.log('FormData:', formData);
        
        try {
          const uploadResponse = await uploadDocument(formData);
          console.log('Upload response:', uploadResponse);
          console.log('Upload response data:', uploadResponse.data);
          
          const fileUrl = uploadResponse.data?.image_url || uploadResponse.data?.file_url || uploadResponse.data?.url;
          console.log('Extracted file URL:', fileUrl);

          if (!fileUrl) {
            console.log('File upload failed - no URL returned');
            console.log('Available fields in response.data:', Object.keys(uploadResponse.data || {}));
            showToast('File upload failed - no URL returned', 'error');
            return;
          }
          
          payload.file = fileUrl;
          payload.document_name = selectedFile.name.split('.')[0];
          payload.document_type = selectedFile.type;
          payload.document_size = (selectedFile.size / (1024 * 1024)).toFixed(2);
        } catch (uploadError) {
          console.error('File upload error:', uploadError);
          const errorMessage = uploadError instanceof Error ? uploadError.message : 'Unknown error';
          showToast('File upload failed: ' + errorMessage, 'error');
          return;
        }
      }

      try {
        const response = await respondToInformationRequest(payload);
        console.log('Response API result:', response);
        
        // Always refresh the requests after successful submission
        console.log('Response successful, refreshing requests...');
        await refetchRequests();
        
        showToast('Response submitted successfully!', 'success');
        setShowResponse(false);
        setSelectedRequest(null);
      } catch (apiError) {
        console.error('Response API error:', apiError);
        throw apiError; // Re-throw to be caught by outer catch block
      }
      
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
    // Use the status directly from the API
    return offer.status || 'pending';
  };

  const getOfferStatusColor = () => {
    const status = getOfferStatus();
    const statusLower = status.toLowerCase();
    if (statusLower === 'accepted' || statusLower === 'client_accepted') return 'bg-green-50 border-green-200';
    if (statusLower === 'rejected') return 'bg-red-50 border-red-200';
    if (statusLower === 'expired' || isOfferExpired()) return 'bg-gray-50 border-gray-200';
    if (statusLower === 'paid') return 'bg-emerald-50 border-emerald-200';
    return 'bg-blue-50 border-blue-200';
  };

  const getOfferStatusText = () => {
    const status = getOfferStatus();
    const statusLower = status.toLowerCase();
    // Format status text for display
    if (statusLower === 'client_accepted') return 'Accepted';
    if (statusLower === 'settlement_approved') return 'Pending';
    if (statusLower === 'paid') return 'Paid';
    // Capitalize first letter and replace underscores with spaces
    return status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ');
  };

  return (
    <div className="mt-6 mb-6">
      <div className={`border rounded-lg p-4 ${getOfferStatusColor()}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 flex items-center justify-center text-[#004D40] font-bold text-lg">₦</div>
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

export default function Dashboard() {
  const router = useRouter();
  const { showToast } = useToast();
  const { handleApiError } = useApiError();

  const [statusFilter, setStatusFilter] = useState<StatusType | 'ALL'>('ALL');

  const { data: claims, isLoading } = useQuery({
    queryKey: ['claims', statusFilter],
    queryFn: () => getSubmitedClaims(statusFilter === 'ALL' ? 'all' : statusFilter.toLowerCase()),
  });


  const [selectedClaim, setSelectedClaim] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string>('');

  const handleClaimSelect = (claimId: string) => {
    setSelectedClaim(claimId === selectedClaim ? null : claimId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleUploadDocument = async (file: File | null) => {
    try {
      if (!selectedDocumentId || !file) {
        showToast("Please select a document to upload", "error");
        return;
      }
      setUploadingDocument(true);
      console.log(selectedDocumentId, 'selectedDocument_______');
      // const resp = await uploadDocument(selectedDocument, file);
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('document_type', selectedDocumentId);

      const response = await uploadDocument(uploadFormData);
      const responseData = response as unknown as UploadDocumentResponse;

      const uploadClaimDocumentResponse = await uploadClaimDocument(selectedDocumentId, responseData.image_url);

      console.log(uploadClaimDocumentResponse, 'uploadClaimDocumentResponse');
      console.log(responseData, 'responseData');



      // console.log(response, 'resp______');
      showToast("Document uploaded successfully", "success");
      setUploadingDocument(false);
      window.location.reload();
    } catch (error: any) {
      setUploadingDocument(false);
      console.log(error, 'error______');
      const errorMessage = handleApiError(error, 'Error uploading document');
      showToast(errorMessage, 'error');
    }
  }

  useEffect(() => {

    const token = cookie().getCookie('token');

    if (!token) {
      router.push('/portal');
    }
  }, [router]);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">Submitted Claims</h1>
        <div className="flex justify-end">
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusType | 'ALL')}
              className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
            >
              <option value="ALL">All Statuses</option>
              {Object.keys(STATUS_BADGES).map((status) => (
                <option key={status} value={status}>
                  {status ? status.replace('_', ' ') : 'Unknown'}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow">
        {isLoading ? (
          <div className="p-6 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#004D40]"></div>
          </div>
        ) : !claims || !claims.data || !claims.data.data || claims.data.data.length === 0 ? (
          <div className="p-6 text-center">
            <div className="mb-4">
              <ClipboardDocumentListIcon className="w-12 h-12 text-gray-400 mx-auto" />
            </div>
            <p className="text-gray-600 text-lg">No claims found</p>
            <p className="text-gray-500 mt-2">There are no claims matching your selected status.</p>
          </div>
        ) : (
          <div className="divide-y">
            {claims.data.data?.map((claim: ClaimData) => {
              // Debug: Log the actual status from API
              if (claim.status === 'default' || claim.status === 'DEFAULT' || !claim.status) {
                console.log('Claim status debug:', {
                  claim_number: claim.claim_number,
                  status: claim.status,
                  statusType: typeof claim.status,
                  allClaimData: claim
                });
              }
              const normalizedStatus = normalizeStatus(claim.status);
              const isApproved = normalizedStatus === 'APPROVED' || normalizedStatus === 'OFFER_ACCEPTED';
              const claimId = String(claim.id || claim.claim_number);
              
              return (
              <div key={claim.claim_number} className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-medium text-gray-900">{claim.claim_number}</span>
                      <StatusBadge status={normalizedStatus} />
                    </div>
                    <p className="text-gray-600 mb-2">{claim?.claim_type_details?.name || claim?.claim_type?.name}</p>
                    <p className="text-gray-600 mb-2">{claim.description}</p>
                    <p className="text-sm text-gray-500">
                      Submitted on {claim.submission_date ? formatDate(claim.submission_date) : formatDate(claim.incident_date)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {isApproved && (
                      <button
                        onClick={() => router.push(`/portal/offer?claimId=${claimId}`)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#004D40] text-white rounded-lg hover:bg-[#003D30] transition-colors text-sm font-medium"
                      >
                        View Offer
                        <ArrowRightIcon className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleClaimSelect(claim.claim_number)}
                      className="text-[#004D40] hover:text-[#003D30]"
                    >
                      <ChevronRightIcon className={`w-6 h-6 transition-transform ${selectedClaim === claim.claim_number ? 'rotate-90' : ''}`} />
                    </button>
                  </div>
                </div>

                {selectedClaim === claim.claim_number && (
                  <div className="mt-6 pt-6 border-t">
                    {/* Required Documents Section */}
                    {claim.documents.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Required Documents</h3>
                        <div className="space-y-3">
                          {claim.documents.map((doc, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <DocumentTextIcon className="w-5 h-5 text-gray-400" />
                                <span className="text-gray-700">{doc.document_type}</span>
                              </div>
                              {!doc.document_uploaded ? (
                                <button
                                  onClick={() => {
                                    setSelectedDocument(doc.document_type);
                                    setSelectedDocumentId(doc?.id.toString() || '');
                                    setShowUploadModal(true);
                                  }}
                                  className="text-sm px-3 py-1 bg-[#004D40] text-white rounded-lg hover:bg-[#003D30]"
                                >
                                  Upload
                                </button>
                              ) : (
                                <span className="text-sm text-green-600 font-medium">Uploaded</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Questions Section */}
                    {
                      claim?.questions && (
                        <div>
                          {claim?.questions?.length > 0 && (
                            <div className="mb-6">
                              <h3 className="text-lg font-medium text-gray-900 mb-4">Questions Requiring Response</h3>
                              <div className="space-y-4">
                                {claim?.questions?.map((q) => (
                                  <div key={q.id} className="bg-orange-50 rounded-lg p-4">
                                    <p className="text-gray-800 mb-2">{q.question}</p>
                                    <button
                                      onClick={() => setShowResponseModal(true)}
                                      className="text-sm px-3 py-1 bg-[#004D40] text-white rounded-lg hover:bg-[#003D30]"
                                    >
                                      Provide Response
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    }

                    {/* Additional Information Requests */}
                    {normalizedStatus !== 'OFFER_PAID' && (
                      <AdditionalInfoRequestsSection claimId={String(claim.id || claim.claim_number)} />
                    )}

                    {/* Offer Section */}
                    <OfferSection claimId={String(claim.id || claim.claim_number)} claimNumber={claim.claim_number} />

                    {/* Claim History */}
                    <div className="mt-8">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Claim History</h3>
                    <div className="relative">
                      <div className="absolute top-0 bottom-0 left-2 w-0.5 bg-gray-200"></div>
                      {
                        claim.claim_history.length > 0 && (
                          <div className="space-y-6">
                            {claim.claim_history
                              .filter(event => event.description && event.description.trim() !== '') // Skip items with no details
                              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) // Sort newest first
                              .map((event, index) => {
                                const eventStatus = normalizeStatus(event.status);
                                const eventStatusConfig = STATUS_BADGES[eventStatus] || STATUS_BADGES.DEFAULT;
                                return (
                                  <div key={index} className="relative flex gap-4">
                                    <div className={`w-4 h-4 rounded-full mt-1.5 ${eventStatusConfig?.color || 'bg-gray-100 text-gray-800'} ring-4 ring-white`}></div>
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
              );
            })}
          </div>
        )}
      </div>

      {/* Document Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Document</h2>
            <p className="text-gray-600 mb-4">Upload {selectedDocument}</p>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-6">
              <input
                type="file"
                className="hidden"
                id="document-upload"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={(e) => handleUploadDocument(e?.target?.files?.[0] || null)}
              />
              <label
                htmlFor="document-upload"
                className="cursor-pointer text-[#004D40] hover:text-[#003D30]"
              >
                <PaperClipIcon className="w-8 h-8 mx-auto mb-2" />
                <p className="font-medium">Click to upload or drag and drop</p>
                <p className="text-sm text-gray-500 mt-1">PDF, DOC, DOCX, JPG or PNG (max 10MB)</p>
              </label>
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-xl"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-[#004D40] text-white rounded-xl hover:bg-[#003D30]"
              >
                {uploadingDocument ? 'Uploading...' : 'Upload Document'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Response Modal */}
      {showResponseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Provide Response</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Response
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
                  placeholder="Type your response here..."
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowResponseModal(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-[#004D40] text-white rounded-xl hover:bg-[#003D30]"
                >
                  Submit Response
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}