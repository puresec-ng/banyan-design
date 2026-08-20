'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  DocumentTextIcon,
  ChevronRightIcon,
  ClipboardDocumentListIcon,
  PaperClipIcon,
} from '@heroicons/react/24/outline';
import { getSubmitedClaims, ClaimData, uploadClaimDocument } from '../../services/dashboard';
import { uploadDocument } from '../../services/public';
import { useApiError } from '../../utils/http';

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from '@/app/context/ToastContext';
import cookie from '@/app/utils/cookie';
import { validateUploadFile } from '../../utils/security';
import {
  StatusType,
  STATUS_BADGES,
  StatusBadge,
  normalizeStatus,
  AdditionalInfoRequestsSection,
  OfferSection,
} from '@/app/components/portal/claim-shared';

interface UploadDocumentResponse {
  image_url: string;
}

export default function Dashboard() {
  const router = useRouter();
  const queryClient = useQueryClient();
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

      const validation = validateUploadFile(file);
      if (!validation.isValid) {
        showToast(validation.message, 'error');
        return;
      }

      setUploadingDocument(true);
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('document_type', selectedDocumentId);

      const response = await uploadDocument(uploadFormData);
      const responseData = response as unknown as UploadDocumentResponse;

      await uploadClaimDocument(selectedDocumentId, responseData.image_url);

      showToast("Document uploaded successfully", "success");
      setUploadingDocument(false);
      setShowUploadModal(false);
      await queryClient.invalidateQueries({ queryKey: ['claims'] });
    } catch (error) {
      setUploadingDocument(false);
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
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">My Support Requests</h1>
        <p className="text-sm text-gray-500 mb-4">Banyan provides claims advisory and documentation support only. Formal claim decisions remain with the insurer or other authorised party.</p>
        <div className="flex justify-end">
          <div className="relative">
            <label htmlFor="status-filter" className="sr-only">Filter by status</label>
            <select
              id="status-filter"
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
            <p className="text-gray-600 text-lg">No support requests found</p>
            <p className="text-gray-500 mt-2">There are no support requests matching your selected status.</p>
          </div>
        ) : (
          <div className="divide-y">
            {claims.data.data?.map((claim: ClaimData) => {
              const normalizedStatus = normalizeStatus(claim.status);

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
                    <button
                      onClick={() => handleClaimSelect(claim.claim_number)}
                      aria-label={selectedClaim === claim.claim_number ? 'Collapse claim details' : 'Expand claim details'}
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
                    <OfferSection claimId={String(claim.id || claim.claim_number)} />

                    {/* Support History */}
                    <div className="mt-8">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Support History</h3>
                    <div className="relative">
                      <div className="absolute top-0 bottom-0 left-2 w-0.5 bg-gray-200"></div>
                      {
                        claim.claim_history.length > 0 && (
                          <div className="space-y-6">
                            {claim.claim_history
                              .filter(event => event.description && event.description.trim() !== '')
                              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                              .map((event, index) => {
                                const eventStatus = normalizeStatus(event.status);
                                const eventStatusConfig = STATUS_BADGES[eventStatus] || STATUS_BADGES.DEFAULT;
                                const eventMeta = event.meta as { request_id?: { details?: string } } | null;
                                return (
                                  <div key={index} className="relative flex gap-4">
                                    <div className={`w-4 h-4 rounded-full mt-1.5 ${eventStatusConfig?.color || 'bg-gray-100 text-gray-800'} ring-4 ring-white`}></div>
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
              );
            })}
          </div>
        )}
      </div>

      {/* Document Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div role="dialog" aria-modal="true" aria-label="Upload supporting documents" className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Supporting Documents</h2>
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
              <label
                htmlFor="document-upload"
                className="cursor-pointer px-4 py-2 bg-[#004D40] text-white rounded-xl hover:bg-[#003D30]"
              >
                {uploadingDocument ? 'Uploading...' : 'Upload Document'}
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Response Modal */}
      {showResponseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div role="dialog" aria-modal="true" aria-label="Provide response" className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Provide Response</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="question-response" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Response
                </label>
                <textarea
                  id="question-response"
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
