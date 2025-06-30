'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserCircleIcon, BanknotesIcon, CheckCircleIcon, XCircleIcon, ArrowLeftIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { CheckIcon, XMarkIcon as XMarkIconSolid } from '@heroicons/react/24/solid';
import cookie from '@/app/utils/cookie';
import { useToast } from '@/app/context/ToastContext';
import { getProfile, lookupBankAccount, storeBankAccount, updateProfile, setBvnVerificationMethod, validateBvnOtp, bvnLookup, } from '@/app/services/dashboard/user-management';
import { useQuery } from "@tanstack/react-query";
import { checkEmail, } from '../../services/auth';

interface EmailCheckResponse {
  exists: boolean;
}

interface BvnMethod {
  method: string;
  hint: string;
}

interface BvnLookupResponse {
  data: {
    methods: BvnMethod[];
    session_id: string;
  };
}

interface BvnDetails {
  email: string;
  phoneNumber: string;
}

// Mock BVN lookup response
const MOCK_BVN_DETAILS = {
  email: 'john@example.com',
  phoneNumber: '+234 801 234 5678',
  firstName: 'John',
  lastName: 'Doe',
};

const BANKS = [{ "code": "044", "name": "Access Bank" }, { "code": "035A", "name": "ALAT by WEMA" }, { "code": "401", "name": "ASO Savings and Loans" }, { "code": "50931", "name": "Bowen Microfinance Bank" }, { "code": "50823", "name": "CEMCS Microfinance Bank" }, { "code": "023", "name": "Citi bank Nigeria" }, { "code": "050", "name": "Ecobank Nigeria" }, { "code": "562", "name": "Ekondo Microfinance Bank" }, { "code": "070", "name": "Fidelity Bank" }, { "code": "011", "name": "First Bank of Nigeria" }, { "code": "214", "name": "First City Monument Bank" }, { "code": "00103", "name": "Globus Bank" }, { "code": "058", "name": "Guaranty Trust Bank" }, { "code": "50383", "name": "Hasal Microfinance Bank" }, { "code": "030", "name": "Heritage Bank" }, { "code": "301", "name": "Jaiz Bank" }, { "code": "082", "name": "Keystone Bank" }, { "code": "50211", "name": "Kuda Bank" }, { "code": "565", "name": "One Finance" }, { "code": "327", "name": "Paga" }, { "code": "526", "name": "Parallex Bank" }, { "code": "100004", "name": "Paycom(Opay)" }, { "code": "076", "name": "Polaris Bank" }, { "code": "101", "name": "Providus Bank" }, { "code": "125", "name": "Rubies MFB" }, { "code": "51310", "name": "Sparkle Microfinance Bank" }, { "code": "221", "name": "Stanbic IBTC Bank" }, { "code": "068", "name": "Standard Chartered Bank" }, { "code": "232", "name": "Sterling Bank" }, { "code": "100", "name": "Suntrust Bank" }, { "code": "302", "name": "TAJ Bank" }, { "code": "51211", "name": "TCF MFB" }, { "code": "102", "name": "Titan Trust Bank" }, { "code": "032", "name": "Union Bank of Nigeria" }, { "code": "033", "name": "United Bank For Africa" }, { "code": "215", "name": "Unity Bank" }, { "code": "566", "name": "VFD" }, { "code": "035", "name": "Wema Bank" }, { "code": "057", "name": "Zenith Bank" }, { "code": "120001", "name": "9mobile 9Payment Service Bank" }, { "code": "404", "name": "Abbey Mortgage Bank" }, { "code": "51204", "name": "Above Only MFB" }, { "code": "602", "name": "Accion Microfinance Bank" }, { "code": "50036", "name": "Ahmadu Bello University Microfinance Bank" }, { "code": "120004", "name": "Airtel Smartcash PSB" }, { "code": "51336", "name": "AKU Microfinance Bank" }, { "code": "90561", "name": "Akuchukwu Microfinance Bank Limited" }, { "code": "90629", "name": "Amegy Microfinance Bank" }, { "code": "50926", "name": "Amju Unique MFB" }, { "code": "51341", "name": "AMPERSAND MICROFINANCE BANK" }, { "code": "50083", "name": "Aramoko MFB" }, { "code": "MFB50094", "name": "Astrapolaris MFB LTD" }, { "code": "90478", "name": "AVUENEGBE MICROFINANCE BANK" }, { "code": "51229", "name": "Bainescredit MFB" }, { "code": "50117", "name": "Banc Corp Microfinance Bank" }, { "code": "50123", "name": "Beststar Microfinance Bank" }, { "code": "FC40163", "name": "Branch International Financial Services Limited" }, { "code": "565", "name": "Carbon" }, { "code": "865", "name": "CASHCONNECT MFB" }, { "code": "50171", "name": "Chanelle Microfinance Bank Limited" }, { "code": "312", "name": "Chikum Microfinance bank" }, { "code": "70027", "name": "CITYCODE MORTAGE BANK" }, { "code": "50910", "name": "Consumer Microfinance Bank" }, { "code": "50204", "name": "Corestep MFB" }, { "code": "559", "name": "Coronation Merchant Bank" }, { "code": "FC40128", "name": "County Finance Limited" }, { "code": "51297", "name": "Crescent MFB" }, { "code": "90560", "name": "Crust Microfinance Bank" }, { "code": "51334", "name": "Davenport MICROFINANCE BANK" }, { "code": "50162", "name": "Dot Microfinance Bank" }, { "code": "50263", "name": "Ekimogun MFB" }, { "code": "90678", "name": "EXCEL FINANCE BANK" }, { "code": "50126", "name": "Eyowo" }, { "code": "51318", "name": "Fairmoney Microfinance Bank" }, { "code": "50298", "name": "Fedeth MFB" }, { "code": "51314", "name": "Firmus MFB" }, { "code": "90164", "name": "FIRST ROYAL MICROFINANCE BANK" }, { "code": "413", "name": "FirstTrust Mortgage Bank Nigeria" }, { "code": "50315", "name": "FLOURISH MFB" }, { "code": "501", "name": "FSDH Merchant Bank Limited" }, { "code": "832", "name": "FUTMINNA MICROFINANCE BANK" }, { "code": "812", "name": "Gateway Mortgage Bank LTD" }, { "code": "90574", "name": "Goldman MFB" }, { "code": "100022", "name": "GoMoney" }, { "code": "90664", "name": "GOOD SHEPHERD MICROFINANCE BANK" }, { "code": "50739", "name": "Goodnews Microfinance Bank" }, { "code": "562", "name": "Greenwich Merchant Bank" }, { "code": "51251", "name": "Hackman Microfinance Bank" }, { "code": "120002", "name": "HopePSB" }, { "code": "51244", "name": "Ibile Microfinance Bank" }, { "code": "50439", "name": "Ikoyi Osun MFB" }, { "code": "50442", "name": "Ilaro Poly Microfinance Bank" }, { "code": "50453", "name": "Imowo MFB" }, { "code": "PMB90058", "name": "IMPERIAL HOMES MORTAGE BANK" }, { "code": "50457", "name": "Infinity MFB" }, { "code": "50502", "name": "Kadpoly MFB" }, { "code": "51308", "name": "KANOPOLY MFB" }, { "code": "50200", "name": "Kredi Money MFB LTD" }, { "code": "90052", "name": "Lagos Building Investment Company Plc." }, { "code": "50549", "name": "Links MFB" }, { "code": "31", "name": "Living Trust Mortgage Bank" }, { "code": "50491", "name": "LOMA MFB" }, { "code": "303", "name": "Lotus Bank" }, { "code": "90171", "name": "MAINSTREET MICROFINANCE BANK" }, { "code": "50563", "name": "Mayfair MFB" }, { "code": "50304", "name": "Mint MFB" }, { "code": "946", "name": "Money Master PSB" }, { "code": "50515", "name": "Moniepoint MFB" }, { "code": "120003", "name": "MTN Momo PSB" }, { "code": "90190", "name": "MUTUAL BENEFITS MICROFINANCE BANK" }, { "code": "90679", "name": "NDCC MICROFINANCE BANK" }, { "code": "50629", "name": "NPF MICROFINANCE BANK" }, { "code": "107", "name": "Optimus Bank Limited" }, { "code": "999991", "name": "PalmPay" }, { "code": "311", "name": "Parkway - ReadyCash" }, { "code": "90680", "name": "PATHFINDER MICROFINANCE BANK LIMITED" }, { "code": "100039", "name": "Paystack-Titan" }, { "code": "50743", "name": "Peace Microfinance Bank" }, { "code": "51146", "name": "Personal Trust MFB" }, { "code": "50746", "name": "Petra Mircofinance Bank Plc" }, { "code": "50021", "name": "PFI FINANCE COMPANY LIMITED" }, { "code": "268", "name": "Platinum Mortgage Bank" }, { "code": "716", "name": "Pocket App" }, { "code": "50864", "name": "Polyunwana MFB" }, { "code": "105", "name": "PremiumTrust Bank" }, { "code": "50023", "name": "PROSPERIS FINANCE LIMITED" }, { "code": "51293", "name": "QuickFund MFB" }, { "code": "502", "name": "Rand Merchant Bank" }, { "code": "90496", "name": "RANDALPHA MICROFINANCE BANK" }, { "code": "90067", "name": "Refuge Mortgage Bank" }, { "code": "50994", "name": "Rephidim Microfinance Bank" }, { "code": "51286", "name": "Rigo Microfinance Bank Limited" }, { "code": "50767", "name": "ROCKSHIELD MICROFINANCE BANK" }, { "code": "51113", "name": "Safe Haven MFB" }, { "code": "951113", "name": "Safe Haven Microfinance Bank Limited" }, { "code": "40165", "name": "SAGE GREY FINANCE LIMITED" }, { "code": "50582", "name": "Shield MFB" }, { "code": "106", "name": "Signature Bank Ltd" }, { "code": "51062", "name": "Solid Allianze MFB" }, { "code": "50800", "name": "Solid Rock MFB" }, { "code": "90162", "name": "STANFORD MICROFINANCE BANK" }, { "code": "51253", "name": "Stellas MFB" }, { "code": "50968", "name": "Supreme MFB" }, { "code": "51269", "name": "Tangerine Money" }, { "code": "50840", "name": "U&C Microfinance Bank Ltd (U AND C MFB)" }, { "code": "51322", "name": "Uhuru MFB" }, { "code": "50870", "name": "Unaab Microfinance Bank Limited" }, { "code": "50871", "name": "Unical MFB" }, { "code": "51316", "name": "Unilag Microfinance Bank" }, { "code": "50894", "name": "Uzondu Microfinance Bank Awka Anambra State" }, { "code": "50020", "name": "Vale Finance Limited" }, { "code": "51355", "name": "Waya Microfinance Bank" }].sort((a, b) => a.name.localeCompare(b.name))


type VerificationMethod = 'email' | 'phone' | 'new-phone';

// Add Snackbar component
const Snackbar = ({ message, onClose, type = 'success' }: { message: string; onClose: () => void; type?: 'success' | 'error' }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 ${type === 'error' ? 'bg-red-600' : 'bg-green-600'} text-white`}>
        {type === 'error' ? <XCircleIcon className="w-5 h-5" /> : <CheckCircleIcon className="w-5 h-5" />}
        <span>{message}</span>
      </div>
    </div>
  );
};

export default function Profile() {
  const router = useRouter();
  // const userCookie = cookie().getCookie('user');
  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ['user'],
    queryFn: () => getProfile(),
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState(user?.email);
  const [bankDetails, setBankDetails] = useState({
    bankName: user?.bank_name || '',
    accountNumber: user?.bank_account_number || '',
    accountName: user?.bank_account_name || '',
  });
  const [bvn, setBvn] = useState('');
  const [isBvnVerified, setIsBvnVerified] = useState(user?.bvn_verified ? true : false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationStep, setVerificationStep] = useState<'bvn' | 'method' | 'new-phone' | 'otp' | 'success'>('bvn');
  const [bvnDetails, setBvnDetails] = useState<BvnDetails | null>(null);
  const [alternativePhone, setAlternativePhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isUpdatingBankDetails, setIsUpdatingBankDetails] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<VerificationMethod | null>(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isEmailAvailable, setIsEmailAvailable] = useState(false);
  const [isLookingUpAccount, setIsLookingUpAccount] = useState(false);
  const [accountLookupError, setAccountLookupError] = useState('');
  const [isEditingBank, setIsEditingBank] = useState(false);
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');
  const [originalBankDetails, setOriginalBankDetails] = useState(bankDetails);
  const [bvnSessionId, setBvnSessionId] = useState<string>('');

  useEffect(() => {
    // Check authentication
    const token = cookie().getCookie('token');
    if (!token) {
      router.push('/portal');
    }

    if (user) {
      console.log(user, 'user111');
      setEmail(user?.email);
      setBankDetails({
        bankName: user?.bank_name,
        accountNumber: user?.bank_account_number,
        accountName: user?.bank_account_name,
      });
      // setBvn(user?.bvn);
      setIsBvnVerified(user?.bvn_verified ? true : false);
    }
  }, [router, isUserLoading, user]);

  const showSuccessMessage = (message: string) => {
    setSnackbarType('success');
    setSnackbarMessage(message);
    setShowSnackbar(true);
  };

  const showErrorMessage = (message: string) => {
    setSnackbarType('error');
    setSnackbarMessage(message);
    setShowSnackbar(true);
  };

  const handleEmailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setEmailError('');
    setIsEmailAvailable(false);

    if (newEmail === user?.email) {
      return;
    }

    if (newEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      setIsCheckingEmail(true);
      try {
        const { data: response } = await checkEmail(newEmail);
        console.log(response, 'response______');
        // if (response.exists) {
        //   setEmailError('This email address is already taken');
        //   setIsEmailAvailable(false);
        // } else {
        //   setIsEmailAvailable(true);
        // }
        setIsEmailAvailable(true);
      } catch (error: any) {
        setEmailError(error?.message || 'Error checking email availability');
        setIsEmailAvailable(false);
      } finally {
        setIsCheckingEmail(false);
      }
    } else if (newEmail) {
      setEmailError('Please enter a valid email address');
    }
  };

  const handleEmailSave = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    } else {
      try {

        setIsLoading(true);
        await updateProfile({ email });
        // setIsEditing(false);
        showSuccessMessage('Email updated successfully');
      } catch (error: any) {
        setEmailError(error?.message || 'An error occurred during email update. Please try again.');
      } finally {
        setIsLoading(false);
        // setIsEditing(false);
      }

    }

  };

  const handleAccountNumberChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const accountNumber = e.target.value;
    setBankDetails({ ...bankDetails, accountNumber });
    setAccountLookupError('');

    // Only lookup if account number is 10 digits and bank is selected
    if (accountNumber.length === 10 && bankDetails.bankName) {
      try {
        setIsLookingUpAccount(true);
        const bankCode = BANKS.find(bank => bank.name === bankDetails.bankName)?.code;
        if (!bankCode) {
          throw new Error('Invalid bank selected');
        }

        const response = await lookupBankAccount({
          account_number: accountNumber,
          bank_code: bankCode
        });

        setBankDetails(prev => ({
          ...prev,
          accountName: response.account_name
        }));
      } catch (error: any) {
        setAccountLookupError(error?.message || 'Failed to lookup account. Please verify the details.');
        setBankDetails(prev => ({
          ...prev,
          accountName: ''
        }));
      } finally {
        setIsLookingUpAccount(false);
      }
    }
  };

  const handleBankDetailsSave = async () => {
    console.log('handleBankDetailsSave called');
    try {
      setIsUpdatingBankDetails(true);
      const resp2 = await storeBankAccount({
        bank_name: bankDetails.bankName,
        account_number: bankDetails.accountNumber,
        bank_account_name: bankDetails.accountName,
        bank_code: BANKS.find(bank => bank.name === bankDetails.bankName)?.code
      });
      console.log('API response:', resp2);
      const isSuccess = resp2 && resp2.account_name && resp2.account_bank;
      console.log('isSuccess:', isSuccess);
      if (isSuccess) {
        setIsUpdatingBankDetails(false);
        showSuccessMessage('Bank details updated successfully');
        setIsEditingBank(false);
      } else {
        setIsUpdatingBankDetails(false);
        showErrorMessage(resp2?.message || 'Failed to update bank details. Please try again.');
      }
    } catch (error: any) {
      setIsUpdatingBankDetails(false);
      showErrorMessage(error?.response?.data?.message || error?.message || 'Failed to update bank details. Please try again.');
    }
  };



  const handleBvnLookup = async () => {
    try {
      setIsVerifying(true);
      setVerificationError('');

      const response = await bvnLookup({ bvn });
      const methods = response?.data?.methods || [];
      const emailMethod = methods.find((m: BvnMethod) => m.method === 'email');
      const phoneMethod = methods.find((m: BvnMethod) => m.method === 'phone');

      setBvnDetails({
        email: emailMethod?.hint?.replace(/^.*to\s*/, '') || '',
        phoneNumber: phoneMethod?.hint?.replace(/^.*to\s*/, '') || '',
      });
      setBvnSessionId(response?.data?.session_id || '');
      setVerificationStep('method');
    } catch (error: any) {
      showErrorMessage(error?.message || 'An error occurred during BVN lookup. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerificationMethod = async (method: VerificationMethod) => {
    try {
      setIsVerifying(true);
      setVerificationError('');
      setSelectedMethod(method);

      // if (method === 'new-phone') {
      //   setVerificationStep('new-phone');
      //   return;
      // }

      const response = await setBvnVerificationMethod({
        request_id: bvnSessionId,
        otp_method: method === "new-phone" ? "phone" : method,
        ...(method === "new-phone" && { phone: alternativePhone }),
      });
      console.log(response, 'response______');

      setVerificationStep('otp');
    } catch (error) {
      showErrorMessage('An error occurred. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleOtpVerification = async () => {
    try {
      setIsVerifying(true);
      setVerificationError('');

      // Simulate OTP verification
      // await new Promise(resolve => setTimeout(resolve, 2000));
      const response = await validateBvnOtp({
        request_id: bvnSessionId,
        otp: otp,
      });
      console.log(response, 'response______');


      setIsBvnVerified(true);
      setVerificationStep('success');
      showSuccessMessage('BVN verified successfully');

    } catch (error: any) {
      showErrorMessage(error?.message || 'An error occurred during verification. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const closeModal = () => {
    setShowVerificationModal(false);
    setVerificationStep('bvn');
    setVerificationError('');
    setSelectedMethod(null);
    setAlternativePhone('');
    setOtp('');
  };

  const renderBvnStep = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Bank Verification Number (BVN)</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={bvn}
            onChange={(e) => setBvn(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
            placeholder="Enter your BVN"
            maxLength={11}
            disabled={isVerifying}
          />
          <button
            onClick={handleBvnLookup}
            disabled={isVerifying || bvn.length !== 11}
            className="px-4 py-2 bg-[#004D40] text-white rounded-lg hover:bg-[#003D30] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isVerifying ? 'Looking up...' : 'Lookup BVN'}
          </button>
        </div>
        {!isVerifying && bvn.length !== 11 && (
          <p className="mt-2 text-sm text-gray-500">BVN must be 11 digits</p>
        )}
      </div>
    </div>
  );

  const renderMethodStep = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-gray-500 hover:text-gray-700 cursor-pointer mb-4" onClick={() => setVerificationStep('bvn')}>
        <ArrowLeftIcon className="w-4 h-4" />
        <span className="text-sm">Back to BVN</span>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">BVN Details</h3>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Email: {bvnDetails?.email}</p>
          <p className="text-sm text-gray-600">Phone: {bvnDetails?.phoneNumber}</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700">Select verification method</h3>
        <div className="space-y-3">
          <button
            onClick={() => handleVerificationMethod('email')}
            className="w-full p-3 border border-gray-300 rounded-lg hover:border-[#004D40] hover:bg-gray-50 text-left"
          >
            <p className="text-sm font-medium text-gray-900">Verify via Email</p>
            <p className="text-sm text-gray-500">{bvnDetails?.email}</p>
          </button>

          <button
            onClick={() => handleVerificationMethod('phone')}
            className="w-full p-3 border border-gray-300 rounded-lg hover:border-[#004D40] hover:bg-gray-50 text-left"
          >
            <p className="text-sm font-medium text-gray-900">Verify via Phone</p>
            <p className="text-sm text-gray-500">{bvnDetails?.phoneNumber}</p>
          </button>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="useAlternativePhone"
                checked={selectedMethod === 'new-phone'}
                onChange={(e) => {
                  setSelectedMethod(e.target.checked ? 'new-phone' : null);
                  if (!e.target.checked) {
                    setAlternativePhone('');
                  }
                }}
                className="rounded border-gray-300 text-[#004D40] focus:ring-[#004D40]"
              />
              <label htmlFor="useAlternativePhone" className="text-sm text-gray-700">
                Use different phone number
              </label>
            </div>

            {selectedMethod === 'new-phone' && (
              <div>
                <input
                  type="tel"
                  value={alternativePhone}
                  maxLength={11}
                  onChange={(e) => setAlternativePhone(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
                  placeholder="Enter alternative phone number"
                />
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => handleVerificationMethod(selectedMethod || 'email')}
          disabled={isVerifying || (selectedMethod === 'new-phone' && !alternativePhone)}
          className="w-full px-4 py-2 bg-[#004D40] text-white rounded-lg hover:bg-[#003D30] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isVerifying ? 'Sending Code...' : 'Send Verification Code'}
        </button>
      </div>
    </div>
  );

  const renderOtpStep = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-gray-500 hover:text-gray-700 cursor-pointer mb-4" onClick={() => {
        // if (selectedMethod === 'new-phone') {
        //   setVerificationStep('new-phone');
        // } else {
        //   setVerificationStep('method');
        // }
        setVerificationStep('method');
      }}>
        <ArrowLeftIcon className="w-4 h-4" />
        <span className="text-sm">Back to {selectedMethod === 'new-phone' ? 'Phone Number' : 'Methods'}</span>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700">Enter verification code</h3>
        <p className="text-sm text-gray-500">
          We sent a verification code to{' '}
          {selectedMethod === 'email' ? bvnDetails?.email :
            selectedMethod === 'phone' ? bvnDetails?.phoneNumber :
              alternativePhone}
        </p>
      </div>

      <div>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
          placeholder="Enter 6-digit code"
          maxLength={6}
        />
      </div>

      <button
        onClick={handleOtpVerification}
        disabled={isVerifying || otp.length !== 6}
        className="w-full px-4 py-2 bg-[#004D40] text-white rounded-lg hover:bg-[#003D30] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isVerifying ? 'Verifying...' : 'Verify Code'}
      </button>

      <p className="text-sm text-gray-500 text-center">
        Didn't receive code? <button className="text-[#004D40] hover:underline">Resend</button>
      </p>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="text-center space-y-4">
      <div className="flex justify-center">
        <CheckCircleIcon className="w-12 h-12 text-green-600" />
      </div>
      <h3 className="text-lg font-medium text-gray-900">BVN Verified Successfully</h3>
      <p className="text-sm text-gray-500">
        Your BVN has been successfully verified and linked to your account.
      </p>
      <button
        onClick={closeModal}
        className="w-full px-4 py-2 bg-[#004D40] text-white rounded-lg hover:bg-[#003D30]"
      >
        Done
      </button>
    </div>
  );

  if (isUserLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#004D40]"></div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Personal Information */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-3 mb-6">
            <UserCircleIcon className="w-6 h-6 text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">First Name</label>
                <p className="text-gray-400 p-2 bg-gray-50 rounded-lg">{user?.first_name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Last Name</label>
                <p className="text-gray-400 p-2 bg-gray-50 rounded-lg">{user?.last_name}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
              <p className="text-gray-400 p-2 bg-gray-50 rounded-lg">{user?.phone}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                {isEditing ? (
                  <>
                    <input
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      className={`w-full p-2 pr-10 border ${emailError ? 'border-red-500' : isEmailAvailable ? 'border-green-500' : 'border-gray-300'
                        } rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent`}
                      placeholder="Enter email address"
                    />
                    <div className="absolute inset-y-0 right-3 flex items-center">
                      {isCheckingEmail && (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#004D40]"></div>
                      )}
                      {/* {!isCheckingEmail && emailError && (
                        <XMarkIconSolid className="h-5 w-5 text-red-500" aria-hidden="true" />
                      )}
                      {!isCheckingEmail && isEmailAvailable && (
                        <CheckIcon className="h-5 w-5 text-green-500" aria-hidden="true" />
                      )} */}
                    </div>
                    {emailError && (
                      <div className="mt-2 flex items-center">
                        <span className="text-sm text-red-500 bg-red-50 px-2 py-1 rounded">
                          {emailError}
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="flex-1 text-gray-900 p-2 bg-gray-50 rounded-lg">{email}</p>
                )}
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleEmailSave}
                  disabled={isEditing && (!!emailError || isCheckingEmail)}
                  className={`px-6 py-2 rounded-lg ${isEditing && (!!emailError || isCheckingEmail)
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-[#004D40] hover:bg-[#003D30]'
                    } text-white font-medium`}
                >
                  {isLoading ? 'Saving...' : isEditing ? 'Save' : 'Edit'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* BVN Verification */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <UserCircleIcon className="w-6 h-6 text-gray-400" />
              <h2 className="text-xl font-semibold text-gray-900">BVN Verification</h2>
            </div>
            {isBvnVerified ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircleIcon className="w-5 h-5" />
                <span className="text-sm font-medium">Verified</span>
              </div>
            ) : (
              <button
                onClick={() => {
                  localStorage.removeItem('bvn');
                  localStorage.removeItem('bvnDetails');
                  setBvn('');
                  setShowVerificationModal(true);
                }}
                className="px-4 py-2 bg-[#004D40] text-white rounded-lg hover:bg-[#003D30]"
              >
                Verify BVN
              </button>
            )}
          </div>
        </div>

        {/* Bank Details */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <BanknotesIcon className="w-6 h-6 text-gray-400" />
              <h2 className="text-xl font-semibold text-gray-900">Bank Account Details</h2>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
              <select
                value={bankDetails.bankName}
                onChange={(e) => {
                  if (isEditingBank) {
                    setBankDetails({ bankName: e.target.value, accountNumber: '', accountName: '' });
                  } else {
                    setBankDetails({ ...bankDetails, bankName: e.target.value });
                  }
                }}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
                disabled={!isEditingBank}
              >
                <option value="">Select a bank</option>
                {BANKS.map((bank) => (
                  <option key={bank.code} value={bank.name}>
                    {bank.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
              <input
                type="text"
                value={bankDetails.accountNumber}
                onChange={handleAccountNumberChange}
                className={`w-full p-2 border ${accountLookupError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent`}
                maxLength={10}
                placeholder="Enter account number"
                disabled={!isEditingBank}
              />
              {isLookingUpAccount && (
                <div className="mt-2 text-sm text-gray-500">
                  Looking up account details...
                </div>
              )}
              {accountLookupError && (
                <div className="mt-2 text-sm text-red-500">
                  {accountLookupError}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
              <input
                type="text"
                value={bankDetails.accountName}
                readOnly
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
                placeholder="Account name will appear here"
              />
            </div>
            <div className="flex justify-end pt-4 gap-2">
              {isEditingBank ? (
                <>
                  <button
                    onClick={async () => {
                      await handleBankDetailsSave();
                      // Only exit edit mode if save is successful (handled in handleBankDetailsSave)
                    }}
                    disabled={isUpdatingBankDetails || !!accountLookupError || !bankDetails.accountName}
                    className={`px-6 py-2 ${isUpdatingBankDetails || !!accountLookupError || !bankDetails.accountName ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#004D40] hover:bg-[#003D30]'} text-white rounded-lg`}
                  >
                    {isUpdatingBankDetails ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => {
                      setBankDetails(originalBankDetails);
                      setIsEditingBank(false);
                    }}
                    className="px-6 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setOriginalBankDetails(bankDetails);
                    setIsEditingBank(true);
                  }}
                  className="px-6 py-2 bg-[#004D40] hover:bg-[#003D30] text-white rounded-lg"
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* BVN Verification Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {verificationStep === 'bvn' && 'Enter BVN'}
                {verificationStep === 'method' && 'Select Verification Method'}
                {verificationStep === 'otp' && 'Enter Verification Code'}
                {verificationStep === 'success' && 'Verification Complete'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {verificationStep === 'bvn' && (
              <>
                {renderBvnStep()}
                {verificationError && (
                  <div className="flex items-center gap-2 mt-2 text-red-600">
                    <XCircleIcon className="w-5 h-5" />
                    <span className="text-sm">{verificationError}</span>
                  </div>
                )}
              </>
            )}
            {verificationStep === 'method' && renderMethodStep()}
            {verificationStep === 'otp' && renderOtpStep()}
            {verificationStep === 'success' && renderSuccessStep()}
          </div>
        </div>
      )}

      {showSnackbar && (
        <Snackbar
          message={snackbarMessage}
          onClose={() => setShowSnackbar(false)}
          type={snackbarType}
        />
      )}
    </main>
  );
} 