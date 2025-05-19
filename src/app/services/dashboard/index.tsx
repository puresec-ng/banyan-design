import { Http } from "../../utils/http";

type ClaimStatus = 'submitted' | 'documents_verified' | 'in_review' | 'approved' | 'rejected' | 'pending_documents' | 'document_requested' | 'pending_response';

interface ClaimHistory {
    id: number;
    claim_id: number;
    description: string;
    status: ClaimStatus;
    meta: null;
    created_at: string;
    updated_at: string;
}

interface Document {
    id: number;
    claim_id: number;
    document_type: string;
    document_url: string;
    created_at: string;
    updated_at: string;
    status: string;
    // name: string;
    document_uploaded: boolean;
    // created_at: string;
    // updated_at: string;
}
interface questions {
    id: number;
    claim_id: number;
    question: string;
    answer: string;
    status: string;
    created_at: string;
    updated_at: string;
}
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
export interface ClaimData {
    claim_number: string;
    incident_location: string;
    incident_date: string;
    description: string;
    claim_type_details: ClaimType;
    claim_type: ClaimType;
    status: string;
    created_at: string;
    claim_history: ClaimHistory[];
    documents: Document[];
    questions?: questions[];
}
interface Link {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
}

interface Meta {
    current_page: number;
    from: number;
    last_page: number;
    links: Link[];
    path: string;
}




interface TrackClaimResponse {
    data: ClaimData;
}
interface ClaimResponse {
    data: {
        data: ClaimData[];
        links: Link;
        meta: Meta;
    }
}


// getsubmited claims
export const getSubmitedClaims = (status?: string): Promise<ClaimResponse> => Http.get(`/claims?status=${status}`);
// export const getSubmitedClaims = (status: string) => Http.get(`/claims/submitted?status=${status}`);

// get pending claims
export const getPendingClaims = () => Http.get(`/claims/pending`);

//claims/track-claim
export const trackClaim = (claimId: string): Promise<TrackClaimResponse> => Http.post(`/claims/track-claim`, { claim_number: claimId });

// claims/upload-document/{{id}}
export const uploadClaimDocument = (id: string, fileUrl: string): Promise<any> => {

    return Http.post(`/claims/upload-document/${id}`, { file_url: fileUrl });
};
// export const uploadClaimDocument = (id: string, file: File): Promise<any> => {
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('document_type', id);
//     return Http.post(`/claims/upload-document/${id}`, formData);
// };
