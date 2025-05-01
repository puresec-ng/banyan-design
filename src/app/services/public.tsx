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
export const submitClaim = (payload: any) => Http.post(`/public/sumbit-claim`, payload);
// /upload-document
export const uploadDocument = (payload: any) => Http.post(`/upload-document`, payload);

// public/contact-us
export const contactUs = (payload: any) => Http.post(`/public/contact-us`, payload);

// public/faq
export const getFaq = () => Http.get(`/public/faq`);

