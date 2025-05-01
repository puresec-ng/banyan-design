import { Http } from "../utils/http";

export const requestVerificationCode = (payload: { email: string }) =>
  Http.post(`/auth/request-verification-code`, payload);

export const verifyEmail = (payload: {
  signUpToken: string;
  verificationCode: string;
}) => Http.post(`/auth/verify-email`, payload);

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

export const login = (payload: { email: string; password: string }) =>
  Http.post(`/auth/login`, payload);

export const forgotPassword = (payload: { email: string }) =>
  Http.post(`/auth/forgot-password`, payload);

export const googleAuth = (route: string) =>
  Http.get(`/auth/google?route=${route}`);

export const resendOtp = (payload: { email: string }) =>
  Http.post(`/auth/resend-otp`, payload);

export const resetPassword = (payload: {
  otp: string;
  password: string;
  password_confirmation: string;
}) => Http.post(`/auth/reset-password`, payload);

export const getUserDetails = () => Http.get(`/user`);

export const editProfile = (payload: any) =>
  Http.patch(`settings/profile`, payload);
