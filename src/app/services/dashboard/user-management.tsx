import { Http } from "../../utils/http";
import { objectToQueryString } from "../../utils/objectToQueryString";


interface Profile {
    account_balance: string;
    address: string;
    bank_account_name: string;
    bank_account_number: string;
    bank_code: string;
    bank_name: string;
    bvn_verified: number;
    created_at: string;
    driver_license_verified: number;
    email: string;
    email_verified_at: string;
    first_name: string;
    id: number;
    last_name: string;
    nin_verified: number;
    phone: string;
    phone_verified_at: string;
    updated_at: string;
}

export interface TransactionHistory {
    id: number;
    amount: number;
    type: string;
    description: string;
    created_at: string;
    status: string;
}

interface TransactionHistoryResponse {
    data: {
        data: TransactionHistory[];
        total: number;
        per_page: number;
        current_page: number;
        total_pages: number;
    }
}

export const getUsers = (): Promise<any> =>
    Http.get(`/user-management/customers`);


//profile
export const getProfile = (): Promise<Profile> =>
    Http.get(`/profile`);
// update profile
export const updateProfile = (data: any): Promise<any> =>
    Http.patch(`/profile/update`, data);

// BVN lookup
export const bvnLookup = (data: any): Promise<any> =>
    Http.post(`/profile/initiate-bvn-validation`, data);

// update BVN
export const updateBvn = (data: any): Promise<any> =>
    Http.put(`/bvn`, data);

// update email
export const updateEmail = (data: any): Promise<any> =>
    Http.put(`/email`, data);

// verify email
export const verifyEmail = (data: any): Promise<any> =>
    Http.post(`/verify-email`, data);

// verify phone number
export const verifyPhone = (data: any): Promise<any> =>
    Http.post(`/verify-phone`, data);

//profile/set-bvn-verification-method
export const setBvnVerificationMethod = (data: any): Promise<any> =>
    Http.post(`/profile/set-bvn-verification-method`, data);

//validate-bvn-otp
export const validateBvnOtp = (data: any): Promise<any> =>
    Http.post(`/profile/validate-bvn-otp`, data);

// transaction history
export const getTransactionHistory = (): Promise<TransactionHistoryResponse> =>
    Http.get(`/transactions`);


// withdraw
export const withdraw = (data: any): Promise<any> =>
    Http.post(`/withdraw`, data);

// profile/change-password
export const changePassword = (data: any): Promise<any> =>
    Http.post(`/profile/change-password`, data);

//profile/update-pin
export const updatePin = (data: any): Promise<any> =>
    Http.patch(`/profile/update-pin`, data);


// profile/store-bank-account
export const storeBankAccount = (data: any): Promise<any> =>
    Http.post(`/profile/store-bank-account`, data);



