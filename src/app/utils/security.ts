import cookie from './cookie';

export const PASSWORD_MIN_LENGTH = 8;

export const AUTH_ERROR_MESSAGES = {
  login: 'Invalid email or password.',
  forgotPassword:
    'If the details provided are correct, further instructions will be sent.',
  otp: 'Invalid or expired code. Please try again.',
  register: 'Unable to complete registration. Please check your details and try again.',
  checkUser: 'Please use a different email or phone number.',
  passwordChange: 'Unable to change password. Please check your details and try again.',
  pinChange: 'Unable to update PIN. Please check your details and try again.',
  default: 'Something went wrong. Please try again.',
} as const;

export type AuthErrorContext = keyof typeof AUTH_ERROR_MESSAGES;

export function getAuthErrorMessage(
  context: AuthErrorContext,
  error?: { response?: { status?: number } }
): string {
  if (error?.response?.status === 429) {
    return 'Too many requests. Please try again later.';
  }
  return AUTH_ERROR_MESSAGES[context] ?? AUTH_ERROR_MESSAGES.default;
}

const COMMON_PINS = new Set([
  '0000', '1111', '2222', '3333', '4444', '5555', '6666', '7777', '8888', '9999',
  '1234', '2345', '3456', '4567', '5678', '6789', '4321', '5432', '6543', '7654',
  '8765', '9876', '0123', '1212', '2121', '6969', '1004', '2000', '2580',
]);

const SEQUENTIAL_PINS = new Set([
  '0123', '1234', '2345', '3456', '4567', '5678', '6789',
  '9876', '8765', '7654', '6543', '5432', '4321', '3210',
]);

export function validatePin(pin: string): { isValid: boolean; message: string } {
  if (pin.length !== 4) {
    return { isValid: false, message: 'PIN must be 4 digits.' };
  }

  if (!/^\d{4}$/.test(pin)) {
    return { isValid: false, message: 'PIN must contain only digits.' };
  }

  if (/^(\d)\1{3}$/.test(pin)) {
    return { isValid: false, message: 'PIN cannot use four identical digits.' };
  }

  if (COMMON_PINS.has(pin) || SEQUENTIAL_PINS.has(pin)) {
    return { isValid: false, message: 'This PIN is too easy to guess. Choose a different PIN.' };
  }

  return { isValid: true, message: '' };
}

export interface PasswordValidation {
  hasMinLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  matches: boolean;
}

export function validatePassword(
  password: string,
  confirmPassword: string = password
): PasswordValidation {
  return {
    hasMinLength: password.length >= PASSWORD_MIN_LENGTH,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    matches: password === confirmPassword && password.length > 0,
  };
}

export interface SafeUser {
  id?: string | number;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  bvn_verified?: boolean | number;
}

export function toSafeUser(user: Record<string, unknown> | null | undefined): SafeUser {
  if (!user || typeof user !== 'object') {
    return {};
  }

  return {
    id: user.id as SafeUser['id'],
    first_name: user.first_name as string | undefined,
    last_name: user.last_name as string | undefined,
    email: user.email as string | undefined,
    phone: user.phone as string | undefined,
    bvn_verified: user.bvn_verified as SafeUser['bvn_verified'],
  };
}

export function persistAuthSession(token: string, user: Record<string, unknown>) {
  cookie().setCookie('token', token);
  cookie().setCookie('user', JSON.stringify(toSafeUser(user)));
}

export function clearAuthSession() {
  cookie().deleteCookie('token');
  cookie().deleteCookie('user');
  cookie().deleteCookie('userType');
  sessionStorage.removeItem('reset_id');
  localStorage.removeItem('registrationData');
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('userPhone');
}

export function setAuthFlash(message: string) {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('auth_flash', message);
  }
}

export function consumeAuthFlash(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const message = sessionStorage.getItem('auth_flash');
  if (message) {
    sessionStorage.removeItem('auth_flash');
  }
  return message;
}

export function maskBvn(bvn: string): string {
  const cleaned = bvn.replace(/\D/g, '');
  if (cleaned.length < 4) {
    return '****';
  }
  return `${'*'.repeat(cleaned.length - 4)}${cleaned.slice(-4)}`;
}

export function maskPhone(phone: string): string {
  const cleaned = phone.replace(/\s/g, '');
  if (cleaned.length < 4) {
    return '****';
  }
  return `${cleaned.slice(0, 4)}${'*'.repeat(Math.max(cleaned.length - 7, 0))}${cleaned.slice(-3)}`;
}

export function maskEmail(email: string): string {
  const [localPart, domain] = email.split('@');
  if (!localPart || !domain) {
    return '****';
  }

  if (localPart.length <= 2) {
    return `${localPart[0] ?? '*'}***@${domain}`;
  }

  return `${localPart.slice(0, 2)}${'*'.repeat(Math.min(localPart.length - 2, 4))}@${domain}`;
}

export const UPLOAD_ALLOWED_EXTENSIONS = [
  '.pdf',
  '.jpg',
  '.jpeg',
  '.png',
  '.doc',
  '.docx',
];

export const UPLOAD_MAX_SIZE_BYTES = 10 * 1024 * 1024;

export interface UploadValidationResult {
  isValid: boolean;
  message: string;
}

export function validateUploadFile(
  file: File,
  options?: {
    maxSizeBytes?: number;
    allowedExtensions?: string[];
  }
): UploadValidationResult {
  const maxSizeBytes = options?.maxSizeBytes ?? UPLOAD_MAX_SIZE_BYTES;
  const allowedExtensions = (options?.allowedExtensions ?? UPLOAD_ALLOWED_EXTENSIONS).map((ext) =>
    ext.toLowerCase()
  );

  const extension = `.${file.name.split('.').pop()?.toLowerCase() ?? ''}`;
  if (!allowedExtensions.includes(extension)) {
    return {
      isValid: false,
      message: `File type not allowed. Accepted formats: ${allowedExtensions.join(', ')}`,
    };
  }

  if (file.size > maxSizeBytes) {
    const maxSizeMb = Math.round(maxSizeBytes / (1024 * 1024));
    return {
      isValid: false,
      message: `File size must be less than ${maxSizeMb}MB.`,
    };
  }

  return { isValid: true, message: '' };
}

export function validateEmailFormat(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function getPasswordValidationErrors(password: string): string[] {
  const rules = validatePassword(password, password);
  const errors: string[] = [];

  if (!rules.hasMinLength) {
    errors.push(`Password must be at least ${PASSWORD_MIN_LENGTH} characters long`);
  }
  if (!rules.hasUpperCase) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!rules.hasLowerCase) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!rules.hasNumber) {
    errors.push('Password must contain at least one number');
  }
  if (!rules.hasSpecialChar) {
    errors.push('Password must contain at least one special character');
  }

  return errors;
}

export function maskAccountNumber(accountNumber: string): string {
  const cleaned = accountNumber.replace(/\D/g, '');
  if (cleaned.length < 4) {
    return '****';
  }
  return `${'*'.repeat(cleaned.length - 4)}${cleaned.slice(-4)}`;
}

const INTERNAL_ERROR_PATTERNS = [
  /\b\d{1,3}(?:\.\d{1,3}){3}\b/,
  /\bsql\b/i,
  /\bstack\b/i,
  /\bexception\b/i,
  /\bat\s+\/.*:\d+/i,
  /ECONNREFUSED/i,
  /\bnginx\b/i,
  /\blaravel\b/i,
  /\btrace\b/i,
];

export function sanitizeClientErrorMessage(message: string, status?: number): string {
  if (status === 401) {
    return 'Unauthorized. Please log in again.';
  }
  if (status === 403) {
    return 'You do not have permission to perform this action.';
  }
  if (status === 429) {
    return 'Too many requests. Please try again later.';
  }
  if (status === 422) {
    return 'Please check your input and try again.';
  }
  if (status && status >= 500) {
    return 'Server error. Please try again later.';
  }

  if (!message || message.trim().length === 0) {
    return 'Something went wrong. Please try again.';
  }

  if (message.length > 200 || INTERNAL_ERROR_PATTERNS.some((pattern) => pattern.test(message))) {
    return 'Something went wrong. Please try again.';
  }

  return message;
}

export { isValidAuthToken } from './authToken';