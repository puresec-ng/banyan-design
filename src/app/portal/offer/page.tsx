'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { getClaimOffer, acceptOffer, rejectOffer, Offer } from '@/app/services/claims';
import { useToast } from '@/app/context/ToastContext';
import { useApiError } from '@/app/utils/http';
import cookie from '@/app/utils/cookie';

function OfferContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { handleApiError } = useApiError();
  
  const [claimId, setClaimId] = useState<string>('');

  useEffect(() => {
    const claimIdParam = searchParams.get('claimId');
    
    if (!claimIdParam) {
      showToast('Claim ID is required', 'error');
      router.push('/portal/dashboard');
      return;
    }
    
    setClaimId(claimIdParam);
  }, [searchParams, router, showToast]);

  // Fetch offer data
  const { data: offerData, isLoading, error } = useQuery({
    queryKey: ['claim-offer', claimId],
    queryFn: () => getClaimOffer(claimId),
    enabled: !!claimId,
    retry: 1,
  });

  const offer = offerData?.data;

  // Accept offer mutation
  const acceptMutation = useMutation({
    mutationFn: () => acceptOffer(offer?.id || ''),
    onSuccess: () => {
      showToast('Offer accepted successfully!', 'success');
      queryClient.invalidateQueries({ queryKey: ['claim-offer', claimId] });
      queryClient.invalidateQueries({ queryKey: ['claims'] });
      setTimeout(() => {
        router.push('/portal/dashboard');
      }, 1500);
    },
    onError: (error: any) => {
      const errorMessage = handleApiError(error, 'Failed to accept offer. Please try again.');
      showToast(errorMessage, 'error');
    },
  });

  // Reject offer mutation
  const rejectMutation = useMutation({
    mutationFn: () => rejectOffer(offer?.id || ''),
    onSuccess: () => {
      showToast('Offer rejected', 'success');
      queryClient.invalidateQueries({ queryKey: ['claim-offer', claimId] });
      queryClient.invalidateQueries({ queryKey: ['claims'] });
      setTimeout(() => {
        router.push('/portal/dashboard');
      }, 1500);
    },
    onError: (error: any) => {
      const errorMessage = handleApiError(error, 'Failed to reject offer. Please try again.');
      showToast(errorMessage, 'error');
    },
  });

  const handleBack = () => {
    router.push('/portal/dashboard');
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    
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

  const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(numAmount)) return '₦0';
    return `₦${numAmount.toLocaleString('en-NG', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  };

  const isOfferExpired = () => {
    if (offer?.expired !== undefined) {
      return offer.expired;
    }
    if (!offer?.expiry_period) return false;
    return new Date(offer.expiry_period) < new Date();
  };

  const canRespondToOffer = () => {
    // Can respond if offer is approved/pending and not expired and not already responded
    const isApproved = offer?.status === 'settlement_approved' || offer?.status === 'pending';
    const notResponded = !offer?.offer_acceptance_status;
    return isApproved && notResponded && !isOfferExpired();
  };

  const getOfferStatus = () => {
    if (offer?.offer_acceptance_status === 'accepted') return 'accepted';
    if (offer?.offer_acceptance_status === 'rejected') return 'rejected';
    if (isOfferExpired()) return 'expired';
    if (offer?.status === 'settlement_approved') return 'pending';
    return offer?.status || 'pending';
  };

  if (!claimId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#004D40]"></div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004D40] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading offer details...</p>
        </div>
      </div>
    );
  }

  if (error || !offer) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Dashboard
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <ExclamationCircleIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Offer Available</h2>
            <p className="text-gray-600 mb-6">
              {error ? 'Failed to load offer details. Please try again later.' : 'No offer has been created for this claim yet.'}
            </p>
            <button
              onClick={handleBack}
              className="px-6 py-2 bg-[#004D40] text-white rounded-lg hover:bg-[#003D30] transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
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
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Claim Details
          </button>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Settlement Offer
            </h1>
            <p className="text-gray-600">
              Review the offer for claim {offer.claim_id}
            </p>
          </div>
        </div>

        {/* Offer Details Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
          {/* Status Banner */}
          <div className={`px-6 py-4 ${
            getOfferStatus() === 'accepted' 
              ? 'bg-green-50 border-b border-green-200' 
              : getOfferStatus() === 'rejected'
              ? 'bg-red-50 border-b border-red-200'
              : isOfferExpired()
              ? 'bg-gray-50 border-b border-gray-200'
              : 'bg-blue-50 border-b border-blue-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getOfferStatus() === 'accepted' ? (
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                ) : getOfferStatus() === 'rejected' ? (
                  <XCircleIcon className="h-6 w-6 text-red-600" />
                ) : isOfferExpired() ? (
                  <ClockIcon className="h-6 w-6 text-gray-600" />
                ) : (
                  <ClockIcon className="h-6 w-6 text-blue-600" />
                )}
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {getOfferStatus() === 'accepted' 
                      ? 'Offer Accepted' 
                      : getOfferStatus() === 'rejected'
                      ? 'Offer Rejected'
                      : isOfferExpired()
                      ? 'Offer Expired'
                      : 'Pending Response'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {getOfferStatus() === 'pending' && !isOfferExpired()
                      ? 'Please review and respond to this offer'
                      : getOfferStatus() === 'accepted'
                      ? 'You have accepted this offer'
                      : getOfferStatus() === 'rejected'
                      ? 'You have rejected this offer'
                      : 'This offer has expired'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Offer Amount */}
          <div className="px-6 py-8 bg-gradient-to-r from-[#004D40] to-[#003D30]">
            <div className="text-center">
              <div className="mb-2">
                <p className="text-white text-sm font-medium">Settlement Amount</p>
              </div>
              <h2 className="text-4xl font-bold text-white mb-2">
                {formatCurrency(offer.offer_amount)}
              </h2>
              {offer.assessed_claim_value && (
                <p className="text-white/80 text-sm mb-1">
                  Assessed Value: {formatCurrency(offer.assessed_claim_value)}
                </p>
              )}
              {offer.expiry_period && !isOfferExpired() && (
                <p className="text-white/80 text-sm mt-2">
                  Valid until {formatDate(offer.expiry_period)}
                </p>
              )}
            </div>
          </div>

          {/* Offer Details */}
          <div className="px-6 py-6 space-y-6">
            {/* Payment Breakdown */}
            {(offer.deductions || offer.service_fee_percentage) && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Payment Breakdown</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  {offer.assessed_claim_value && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Assessed Claim Value:</span>
                      <span className="font-medium text-gray-900">{formatCurrency(offer.assessed_claim_value)}</span>
                    </div>
                  )}
                  {offer.deductions && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Deductions:</span>
                      <span className="font-medium text-red-600">-{formatCurrency(offer.deductions)}</span>
                    </div>
                  )}
                  {offer.service_fee_percentage && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service Fee ({offer.service_fee_percentage}%):</span>
                      <span className="font-medium text-gray-900">
                        -{formatCurrency((parseFloat(offer.assessed_claim_value || '0') * parseFloat(offer.service_fee_percentage) / 100).toString())}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between">
                    <span className="font-semibold text-gray-900">Settlement Amount:</span>
                    <span className="font-bold text-[#004D40] text-lg">{formatCurrency(offer.offer_amount)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Information */}
            {(offer.payment_method || offer.payment_timeline) && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Payment Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  {offer.payment_method && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="font-medium text-gray-900">{offer.payment_method}</span>
                    </div>
                  )}
                  {offer.payment_timeline && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Timeline:</span>
                      <span className="font-medium text-gray-900">{offer.payment_timeline} days</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Terms */}
            {offer.offer_terms && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Terms & Conditions</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                    {offer.offer_terms}
                  </p>
                </div>
              </div>
            )}

            {/* Special Conditions */}
            {offer.special_conditions && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Special Conditions</h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 text-sm leading-relaxed whitespace-pre-line">
                    {offer.special_conditions}
                  </p>
                </div>
              </div>
            )}

            {/* Offer Information */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold text-gray-900 mb-4">Offer Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Offer ID</p>
                  <p className="font-medium text-gray-900">{offer.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Claim Number</p>
                  <p className="font-medium text-gray-900">{offer.claim_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Claim Type</p>
                  <p className="font-medium text-gray-900">{offer.claim_type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Created</p>
                  <p className="font-medium text-gray-900">{formatDate(offer.created_at)}</p>
                </div>
                {offer.expiry_period && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Valid Until</p>
                    <p className={`font-medium ${isOfferExpired() ? 'text-red-600' : 'text-gray-900'}`}>
                      {formatDate(offer.expiry_period)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {canRespondToOffer() && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Response</h3>
            <p className="text-gray-600 mb-6">
              Please review the offer carefully. Once you accept or reject, this action cannot be undone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => acceptMutation.mutate()}
                disabled={acceptMutation.isPending || rejectMutation.isPending}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#004D40] text-white rounded-lg hover:bg-[#003D30] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {acceptMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Accepting...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-5 w-5" />
                    Accept Offer
                  </>
                )}
              </button>
              <button
                onClick={() => rejectMutation.mutate()}
                disabled={acceptMutation.isPending || rejectMutation.isPending}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-900 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {rejectMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                    Rejecting...
                  </>
                ) : (
                  <>
                    <XCircleIcon className="h-5 w-5" />
                    Reject Offer
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Expired or Already Responded Message */}
        {(isOfferExpired() || offer.offer_acceptance_status) && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <ExclamationCircleIcon className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-900 mb-1">
                  {isOfferExpired() ? 'Offer Expired' : 'Already Responded'}
                </h3>
                <p className="text-yellow-800 text-sm">
                  {isOfferExpired()
                    ? 'This offer has expired and is no longer available for acceptance.'
                    : `You have already ${offer.offer_acceptance_status} this offer.`}
                </p>
                {offer.offer_acceptance_notes && (
                  <p className="text-yellow-700 text-sm mt-2 italic">
                    Notes: {offer.offer_acceptance_notes}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OfferPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#004D40]"></div>
      </div>
    }>
      <OfferContent />
    </Suspense>
  );
}

