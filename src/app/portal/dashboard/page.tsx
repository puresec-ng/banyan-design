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
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
  QuestionMarkCircleIcon,
  ExclamationCircleIcon,
  PaperClipIcon,
} from '@heroicons/react/24/outline';
import { getSubmitedClaims, ClaimData, uploadClaimDocument } from '../../services/dashboard';
import { uploadDocument } from '../../services/public';
import { useApiError } from '../../utils/http';

import { useQuery } from "@tanstack/react-query";
import { useToast } from '@/app/context/ToastContext';
import cookie from '@/app/utils/cookie';



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

type StatusType = 'SUBMITTED' | 'DOCUMENTS_VERIFIED' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'PENDING_DOCUMENTS' | 'DOCUMENTS_REQUESTED' | 'PENDING_RESPONSE';

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

const StatusBadge = ({ status }: { status: StatusType }) => {
  const StatusIcon = STATUS_BADGES[status].icon;
  return (
    <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5 ${STATUS_BADGES[status].color}`}>
      <StatusIcon className="w-4 h-4" />
      {status.replace('_', ' ')}
    </div>
  );
};

// Mock user data - In a real app, this would come from your auth system
const MOCK_USER = {
  name: 'John Doe',
  email: 'john@example.com',
  avatar: null,
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

  console.log(claims, 'claims_________');

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
                  {status.replace('_', ' ')}
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
            {claims.data.data?.map((claim: ClaimData) => (
              <div key={claim.claim_number} className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-medium text-gray-900">{claim.claim_number}</span>
                      <StatusBadge status={claim.status.toString().toUpperCase() as StatusType} />
                    </div>
                    <p className="text-gray-600 mb-2">{claim?.claim_type_details?.name || claim?.claim_type?.name}</p>
                    <p className="text-gray-600 mb-2">{claim.description}</p>
                    <p className="text-sm text-gray-500">
                      Submitted on {formatDate(claim.incident_date)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleClaimSelect(claim.claim_number)}
                    className="text-[#004D40] hover:text-[#003D30]"
                  >
                    <ChevronRightIcon className={`w-6 h-6 transition-transform ${selectedClaim === claim.claim_number ? 'rotate-90' : ''}`} />
                  </button>
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

                    {/* Claim History */}
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Claim History</h3>
                    <div className="relative">
                      <div className="absolute top-0 bottom-0 left-2 w-0.5 bg-gray-200"></div>
                      {
                        claim.claim_history.length > 0 && (
                          <div className="space-y-6">
                            {claim.claim_history.map((event, index) => (
                              <div key={index} className="relative flex gap-4">
                                <div className={`w-4 h-4 rounded-full mt-1.5 ${STATUS_BADGES[event.status?.toString().toUpperCase() as StatusType].color} ring-4 ring-white`}></div>
                                <div>
                                  <p className="font-medium text-gray-900 capitalize">
                                    {event.status.replace('_', ' ')}
                                  </p>
                                  <p className="text-gray-600 text-sm">{event.description}</p>
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
                )}
              </div>
            ))}
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