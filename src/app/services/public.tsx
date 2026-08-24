import { Http } from "../utils/http";

interface ClaimType {
    id: number;
    name: string;
    code: string;
    tracking_prefix: string;
    description: string;
    required_documents: string;
    active: number;
    processing_time_estimate: number;
    created_at: string;
    updated_at: string;
}
export type ClaimTypeResponse = ClaimType[];

export interface Insurer {
    id: number;
    name: string;
    code: string;
    logo: string;
    contact_email: string;
    contact_phone: string;
    address: string;
    active: number;
    supported_claim_types: string;
    special_instructions: string | null;
    created_at: string;
    updated_at: string;
}
export type InsurerResponse = Insurer[];

export interface IncidentType {
    id: number;
    name: string;
    code: string;
    description: string;
    applicable_claim_types: string;
    // required_documents: any[];
    required_documents: string;
    active: number;
    created_at: string;
    updated_at: string;
}
export type IncidentTypeResponse = IncidentType[];

export const requestVerificationCode = (payload: { email: string }) =>
    Http.post(`/auth/request-verification-code`, payload);

// public/claim-types
export const getClaimTypes = (): Promise<ClaimTypeResponse> =>
    Http.get(`/public/claim-types`);

//public/incident-types 
export const getIncidentTypes = (): Promise<IncidentTypeResponse> => Http.get(`/public/incident-types`);

//public/insurers
export const getInsurers = (): Promise<InsurerResponse> => Http.get(`/public/insurers`);

// public/sumbit-claim
export const submitClaim = (payload: any) => Http.post(`/public/submit-claim`, payload);
export const authSubmitClaim = (payload: any) => Http.post(`/claims/submit`, payload);
// /upload-document
export const uploadDocument = (payload: FormData) => {
    return Http.post(`/upload-document`, payload, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export type SupportServiceCode =
    | 'claims_advisory'
    | 'documentation_support'
    | 'workflow_tracking'
    | 'training_capacity_building'
    | 'research_process_review'
    | 'general_enquiry';

export interface SupportRequestPayload {
    service_code: SupportServiceCode;
    name: string;
    organisation: string | null;
    email: string;
    phone: string | null;
    summary: string | null;
    objective: string | null;
    preferred_date: string | null;
    location: string | null;
    participant_estimate: number | null;
    message: string | null;
    privacy_consent: boolean;
    privacy_notice_version: string;
    source: 'website';
}

export interface SupportRequestResponse {
    data?: {
        reference?: string;
        status?: string;
        created_at?: string;
    };
    message?: string;
}

// public/contact-us accepts the structured support-request contract.
export const requestSupport = (payload: SupportRequestPayload): Promise<SupportRequestResponse> =>
    Http.post(`/public/contact-us`, payload);

// Keep the general contact form on the same structured backend contract.
export const contactUs = (payload: {
    service_code: SupportServiceCode;
    name: string;
    organisation: string | null;
    email: string;
    phone: string | null;
    message: string;
    privacy_consent: boolean;
}): Promise<SupportRequestResponse> =>
    requestSupport({
        service_code: payload.service_code,
        name: payload.name,
        organisation: payload.organisation,
        email: payload.email,
        phone: payload.phone,
        summary: payload.message,
        objective: null,
        preferred_date: null,
        location: null,
        participant_estimate: null,
        message: null,
        privacy_consent: payload.privacy_consent,
        privacy_notice_version: '2026-08-17',
        source: 'website',
    });

// public/faq
export const getFaq = () => Http.get(`/public/faq`);

export type BankType = { code: string; name: string };
export interface BanksApiResponse { banks: BankType[] }

export const getBanks = (): Promise<BanksApiResponse> => Http.get(`/banks`);
