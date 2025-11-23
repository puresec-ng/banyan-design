import { Http } from "../utils/http";

// Types for additional information and document requests
export interface AdditionalInfoRequest {
  id: string;
  claimId: string;
  requestType: 'document_request' | 'additional_information';
  title: string;
  description: string;
  fields?: FormField[];
  documents?: DocumentRequest[];
  status: 'pending' | 'completed' | 'overdue';
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'number' | 'email' | 'phone';
  required: boolean;
  placeholder?: string;
  options?: string[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
  value?: string;
}

export interface DocumentRequest {
  id: string;
  name: string;
  description: string;
  type: string;
  required: boolean;
  acceptedFormats: string[];
  maxSize: number; // in MB
  uploadedFile?: string;
  status: 'pending' | 'uploaded' | 'verified' | 'rejected';
}

export interface AdditionalInfoRequestResponse {
  data: AdditionalInfoRequest;
  success: boolean;
  message: string;
}

export interface SubmitAdditionalInfoPayload {
  requestId: string;
  responses: {
    fieldId: string;
    value: string;
  }[];
  documents?: {
    documentId: string;
    fileUrl: string;
  }[];
}

export interface SubmitAdditionalInfoResponse {
  success: boolean;
  message: string;
  data: {
    requestId: string;
    status: string;
    submittedAt: string;
  };
}

// API functions
export const getAdditionalInfoRequest = async (
  claimId: string, 
  requestType: 'document_request' | 'additional_information'
): Promise<AdditionalInfoRequestResponse> => {
  return Http.get(`/claims/additional-information-requests/${claimId}?request_type=${requestType}`);
};

// Function to check if a request has been responded to
export const checkRequestStatus = async (
  claimId: string, 
  requestType: 'document_request' | 'additional_information'
): Promise<AdditionalInfoRequestResponse> => {
  return Http.get(`/claims/additional-information-requests/${claimId}?request_type=${requestType}`);
};

export const submitAdditionalInfoResponse = async (
  payload: SubmitAdditionalInfoPayload
): Promise<SubmitAdditionalInfoResponse> => {
  return Http.post('/claims/additional-information-responses', payload);
};

export const uploadDocumentForRequest = async (
  requestId: string,
  documentId: string,
  fileUrl: string
): Promise<any> => {
  return Http.post(`/claims/additional-information-responses/${requestId}/documents`, {
    documentId,
    fileUrl
  });
};

// Offer-related types and functions
export interface Offer {
  id: number;
  claim_type: string;
  client: string;
  claim_id: string;
  calculation_breakdown: string | null;
  offer_modifications: string | null;
  assessed_claim_value: string;
  fee_structure: string | null;
  offer_amount: string;
  offer_terms: string | null;
  expiry_period: string;
  status: string; // e.g., "settlement_approved", "pending", etc.
  approval_notes: string | null;
  rejection_reason: string | null;
  offer_acceptance_notes: string | null;
  offer_acceptance_status: 'accepted' | 'rejected' | null;
  offer_acceptance_reason: string | null;
  approved_by: string | null;
  rejected_by: string | null;
  approved_at: string | null;
  rejected_at: string | null;
  created_at: string;
  updated_at: string;
  deductions: string;
  service_fee_percentage: string;
  payment_method: string;
  payment_timeline: string;
  offer_validity_period: string;
  supporting_documents: any[];
  special_conditions: string | null;
  expired: boolean;
  contact_method: string | null;
  settlement_offer_letter: number;
  payment_breakdown: number;
  terms_and_condition: number;
  bank_details_form: number;
  acceptance_form: number;
  subject_line: string | null;
  message: string | null;
  tracking_number: string | null;
  scheduled_send_date: string | null;
  presented_at: string | null;
  client_response: string | null;
  send_status: string;
}

export interface OfferListResponse {
  data: {
    data: Offer[];
    links: {
      first: string;
      last: string;
      prev: string | null;
      next: string | null;
    };
    meta: {
      current_page: number;
      from: number;
      last_page: number;
      links: Array<{
        url: string | null;
        label: string;
        active: boolean;
      }>;
      path: string;
      per_page: number;
      to: number;
      total: number;
    };
  };
}

export interface OfferResponse {
  data: Offer;
  success?: boolean;
  message?: string;
}

export interface AcceptRejectOfferResponse {
  success: boolean;
  message: string;
  data: {
    offerId: string;
    status: 'accepted' | 'rejected';
    updatedAt: string;
  };
}

// Get offer for a claim (user-facing endpoint)
export const getClaimOffer = async (claimId: string): Promise<OfferResponse> => {
  try {
    const response: any = await Http.get(`/claims/claim-offer/${claimId}`);
    console.log('getClaimOffer response:', response);
    
    // Http interceptor already returns response.data from axios
    // The API might return { data: Offer } or Offer directly
    if (response) {
      // If response has a nested data property with offer fields
      if (response.data && typeof response.data === 'object' && (response.data.id || response.data.offer_amount)) {
        return { data: response.data };
      }
      // If response itself is the offer (has offer fields)
      if ((response as any).id || (response as any).offer_amount) {
        return { data: response as Offer };
      }
    }
    console.error('Invalid response structure:', response);
    throw new Error('No offer found for this claim');
  } catch (error: any) {
    console.error('getClaimOffer error:', error);
    console.error('Error response:', error?.response);
    throw error;
  }
};

// Accept an offer
export const acceptOffer = async (claimOfferId: string | number, payload?: { reason?: string; notes?: string }): Promise<AcceptRejectOfferResponse> => {
  const requestBody: any = {
    claim_offer_id: claimOfferId,
    status: 'accepted_offer',
    ...(payload || {})
  };
  return Http.post('/claims/process-claim-offer', requestBody);
};

// Reject an offer
export const rejectOffer = async (claimOfferId: string | number, payload?: { reason?: string }): Promise<AcceptRejectOfferResponse> => {
  const requestBody: any = {
    claim_offer_id: claimOfferId,
    status: 'rejected_offer',
    rejection_reason: payload?.reason || ''
  };
  return Http.post('/claims/process-claim-offer', requestBody);
};
