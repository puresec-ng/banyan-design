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
