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
interface RegisterResponse {
  token: string;
  user: any;
}

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
  signUpToken: "string";
  firstName: "string";
  lastName: "string";
  businessName: "string";
  businessType: "string";
  industry: "string";
}) => Http.post(`/auth/set-details`, payload);

export const login = (payload: { email: string; password: string }): Promise<RegisterResponse> =>
  Http.post(`/auth/login`, payload);

export const register = (payload: RegisterPayload): Promise<RegisterResponse> =>
  Http.post(`/auth/register`, payload);

export const forgotPassword = (payload: { email: string }) =>
  Http.post(`/auth/forgot-password`, payload);

export const googleAuth = (route: string) =>
  Http.get(`/auth/google?route=${route}`);

export const resendOtp = (payload: { email: string }) =>
  Http.post(`/auth/resend-otp`, payload);

export const resetPassword = (payload: {
  otp: string;
  reset_id: string;
  password: string;
  password_confirmation: string;
}) => Http.post(`/auth/reset-password`, payload);

export const getUserDetails = () => Http.get(`/user`);

export const editProfile = (payload: any) =>
  Http.patch(`settings/profile`, payload);



// create pin
export const createPin = (payload: {
  pin: string;
  pin_confirmation: string;
}) => Http.post(`/auth/create-pin`, payload);

// check email
export const checkEmail = (payload: any) =>
  Http.post(`/auth/check-user`, payload);

// check phone
export const checkPhone = (payload: any) =>
  Http.post(`/auth/check-user`, payload);
