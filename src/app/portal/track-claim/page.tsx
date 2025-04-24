'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  MagnifyingGlassIcon,
  ExclamationCircleIcon,
  DocumentTextIcon,
  PaperClipIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

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

const StatusBadge = ({ status }: { status: StatusType }) => {
  const StatusIcon = STATUS_BADGES[status].icon;
  return (
    <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5 ${STATUS_BADGES[status].color}`}>
      <StatusIcon className="w-4 h-4" />
      {status.replace('_', ' ')}
    </div>
  );
};

export default function TrackClaim() {
  const router = useRouter();
  const [claimId, setClaimId] = useState('');
  const [claim, setClaim] = useState<Claim | null>(null);
  const [error, setError] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      router.push('/portal');
    }
  }, [router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSearching(true);

    // Simulate API call delay
    setTimeout(() => {
      const formattedClaimId = claimId.trim().toUpperCase();
      const foundClaim = MOCK_CLAIMS[formattedClaimId];

      if (foundClaim) {
        setClaim(foundClaim);
      } else {
        setError('No claim found with this ID. Please check the ID and try again.');
        setClaim(null);
      }
      setIsSearching(false);
    }, 1000);
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
                  <span className="font-medium text-gray-900">{claim.id}</span>
                  <StatusBadge status={claim.status} />
                </div>
                <span className="text-gray-500 text-sm">
                  Last updated: {formatDate(claim.updatedAt)}
                </span>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-500">Type</span>
                  <p className="font-medium text-gray-900">{claim.type}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Description</span>
                  <p className="text-gray-900">{claim.description}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Amount</span>
                  <p className="font-medium text-gray-900">₦{claim.amount.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Required Documents Section */}
            {'requiredDocuments' in claim && (
              <div className="p-6 border-b">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Required Documents</h3>
                <div className="space-y-3">
                  {claim.requiredDocuments.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DocumentTextIcon className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-700">{doc.name}</span>
                      </div>
                      <span className={`text-sm font-medium ${
                        doc.status === 'UPLOADED' ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {doc.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Questions Section */}
            {'questions' in claim && claim.questions && (
              <div className="p-6 border-b">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Questions</h3>
                <div className="space-y-4">
                  {claim.questions.map((q) => (
                    <div key={q.id} className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-800 mb-2">{q.question}</p>
                      <span className={`text-sm font-medium ${
                        q.status === 'ANSWERED' ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {q.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Claim History */}
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Claim History</h3>
              <div className="relative">
                <div className="absolute top-0 bottom-0 left-2 w-0.5 bg-gray-200"></div>
                <div className="space-y-6">
                  {claim.history.map((event, index) => (
                    <div key={index} className="relative flex gap-4">
                      <div className={`w-4 h-4 rounded-full mt-1.5 ${STATUS_BADGES[event.status].color} ring-4 ring-white`}></div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {event.status.replace('_', ' ')}
                        </p>
                        <p className="text-gray-600 text-sm">{event.note}</p>
                        <p className="text-gray-500 text-sm mt-1">
                          {formatDate(event.date)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 