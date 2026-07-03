const CLAIM_DRAFT_KEYS = [
  'personalInfo',
  'basicInfo',
  'selectedClaimType',
  'documents',
  'submissionDetails',
  'claimNumber',
  'claimType',
  'paymentModel',
  'uploadedDocuments',
] as const;

export type ClaimDraftKey = (typeof CLAIM_DRAFT_KEYS)[number];

export const claimDraftStorage = {
  getItem(key: ClaimDraftKey): string | null {
    if (typeof window === 'undefined') {
      return null;
    }
    return sessionStorage.getItem(key);
  },

  setItem(key: ClaimDraftKey, value: string): void {
    if (typeof window === 'undefined') {
      return;
    }
    sessionStorage.setItem(key, value);
  },

  removeItem(key: ClaimDraftKey): void {
    if (typeof window === 'undefined') {
      return;
    }
    sessionStorage.removeItem(key);
  },

  clearAll(): void {
    if (typeof window === 'undefined') {
      return;
    }
    CLAIM_DRAFT_KEYS.forEach((key) => sessionStorage.removeItem(key));
  },
};
