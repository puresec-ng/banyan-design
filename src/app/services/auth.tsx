import { Http } from "../utils/http";

interface RegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  accept_tc: string;
  phone: string;
  password: string;
  referral_code: string;
  password_confirmation: string;
}

interface VerifyEmailPayload {
  email: string;
  otp: string;
  otp_type: string;
}
// register response
export interface AuthSession {
  token: string;
  user: Record<string, unknown>;
}

type ApiResponse = Record<string, unknown>;

const isRecord = (value: unknown): value is ApiResponse =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/**
 * The API has returned session details both directly and inside a `data`
 * envelope. Keep that variation at the service boundary so registration and
 * verification screens never save an `undefined` token as a real session.
 */
export const getAuthSession = (response: unknown): AuthSession | null => {
  if (!isRecord(response)) {
    return null;
  }

  const candidates = [response, response.data].filter(isRecord);

  for (const candidate of candidates) {
    const token = candidate.token ?? candidate.access_token ?? candidate.accessToken;
    if (typeof token !== 'string' || token.trim() === '') {
      continue;
    }

    return {
      token,
      user: isRecord(candidate.user) ? candidate.user : {},
    };
  }

  return null;
};

export const requestVerificationCode = (payload: { email: string }) =>
  Http.post(`/auth/resend-otp`, payload);

export const verifyEmail = (payload: VerifyEmailPayload) =>
  Http.post(`/auth/verify-account`, payload);

export const setPassword = (payload: {
  signUpToken: string;
  password: string;
  confirmPassword: string;
}) => Http.post(`/auth/set-password`, payload);

export const setBusinessDetails = (payload: {
  signUpToken: string;
  firstName: string;
  lastName: string;
  businessName: string;
  businessType: string;
  industry: string;
}) => Http.post(`/auth/set-details`, payload);

export const login = (payload: { email: string; password: string }): Promise<ApiResponse> => {
  return Http.post(`/auth/login`, payload);
};

export const register = (payload: RegisterPayload): Promise<ApiResponse> =>
  Http.post(`/auth/register`, payload);

export const forgotPassword = (payload: { email: string }) =>
  Http.post(`/auth/forgot-password`, payload);

export const resendOtp = (payload: { email: string }) =>
  Http.post(`/auth/resend-otp`, payload);

export const resetPassword = (payload: {
  otp: string;
  reset_id: string;
  password: string;
  password_confirmation: string;
}) => Http.post(`/auth/reset-password`, payload);

export const getUserDetails = () => Http.get(`/user`);

export const editProfile = (payload: Record<string, unknown>) =>
  Http.patch(`settings/profile`, payload);

// create pin
export const createPin = (payload: {
  pin: string;
  pin_confirmation: string;
}) => Http.post(`/profile/create-pin`, payload);
