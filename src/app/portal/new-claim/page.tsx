'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  DocumentTextIcon,
  PhotoIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  XMarkIcon, ArrowUpTrayIcon,
} from '@heroicons/react/24/outline';
import cookie from '@/app/utils/cookie';

import { getClaimTypes, authSubmitClaim, getInsurers, Insurer, getIncidentTypes, IncidentType, uploadDocument, submitClaim } from '@/app/services/public';
import { useQuery } from "@tanstack/react-query";
import { useToast } from '@/app/context/ToastContext';

// type ClaimType = 'MOTOR' | 'GADGET' | 'PROPERTY' | 'BUSINESS';
type ClaimType = string;

interface FormData {
  type: ClaimType;
  insuranceProvider: string;
  incidentType: string;
  incidentDate: string;
  incidentTime: string;
  incidentLocation: string;
  description: string;
  policyNumber: string;
  documents: { name: string, id: string, file: File | null }[];
  additionalInfo: string;
}

interface UploadedDocument {
  id: string;
  name: string;
  file: string;
}
interface UploadDocumentResponse {
  image_url: string;
}


export default function NewClaim() {
  const router = useRouter();
  const userCookie = cookie().getCookie('user');
  const user = JSON.parse(userCookie || '{}');
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [skipDocuments, setSkipDocuments] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    type: '',
    insuranceProvider: '',
    incidentType: '',
    incidentDate: '',
    incidentTime: '',
    incidentLocation: '',
    description: '',
    policyNumber: '',
    documents: [],
    additionalInfo: '',
  });
  const [imageURL, setImageURL] = useState<UploadedDocument[]>([]);
  const [uploading, setUploading] = useState(false);


  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [claimTypes, setClaimTypes] = useState<any[]>([]);

  const { data: claimTypesData, isLoading: claimTypesLoading } = useQuery({
    queryKey: ['claimTypes'],
    queryFn: getClaimTypes,
  });

  const { data: insurers, isLoading, error } = useQuery({
    queryKey: ['insurers'],
    queryFn: getInsurers,
  });

  const { data: incidentTypes } = useQuery<IncidentType[]>({
    queryKey: ['incidentTypes'],
    queryFn: getIncidentTypes,
  });

  useEffect(() => {

    const token = cookie().getCookie('token');
    if (!token) {
      router.push('/portal');
    }
  }, [router]);

  const handleNext = () => {
    if (currentStep === 1) {
      if (formData.type !== '') {
        setCurrentStep(currentStep + 1);
      } else {
        showToast('Please select a claim type', 'error');
      }
    }
    if (currentStep === 2) {
      // Validate all required fields
      if (!formData.insuranceProvider) {
        showToast('Please select an insurance provider', 'error');
        return;
      }
      if (!formData.incidentType) {
        showToast('Please select an incident type', 'error');
        return;
      }
      if (!formData.incidentDate) {
        showToast('Please select an incident date', 'error');
        return;
      }
      if (!formData.incidentTime) {
        showToast('Please select an incident time', 'error');
        return;
      }
      if (!formData.incidentLocation) {
        showToast('Please enter the incident location', 'error');
        return;
      }
      if (!formData.description) {
        showToast('Please provide a description of the incident', 'error');
        return;
      }

      const selectedIncidentType = incidentTypes?.find(t => t.name === formData.incidentType);
      console.log(JSON.parse(selectedIncidentType?.required_documents || '[]'), 'selectedIncidentType');
      if (selectedIncidentType) {
        setFormData({ ...formData, documents: JSON.parse(selectedIncidentType?.required_documents || '[]')?.map((doc: any, index: number) => ({ name: doc, id: index.toString() })) || [] });
      }
      setCurrentStep(currentStep + 1);
    }
    if (currentStep === 3) {
      // Check if all documents are uploaded or if skip was chosen
      if (!skipDocuments && !formData.documents.every(doc => doc.file)) {
        showToast('Please upload all required documents or choose to skip', 'error');
        return;
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Here you would typically send the form data to your API
      console.log('Submitting claim:', formData);
      const selectedIncidentType = incidentTypes?.find(t => t.name === formData.incidentType);
      const selectedIncidentTypeId = selectedIncidentType?.id;
      const insurerId = insurers?.find(i => i.name === formData.insuranceProvider)?.id;
      // const selectedClaimType = claimTypesData?.find(t => t.id === formData.type);
      // const selectedClaimTypeId = selectedClaimType?.id;
      const samplePayload = {
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        email: user.email,
        claim_type: formData.type,
        incident_type: selectedIncidentTypeId,
        incident_date: `${formData.incidentDate} ${formData.incidentTime}:00`,
        incident_location: formData.incidentLocation,
        description: formData.description,
        policy_number: formData.policyNumber,
        insurer_id: insurerId,
        payment_model: 1,
        file_url: imageURL.map((doc: any) => doc.file)
      }
      console.log(samplePayload, 'samplePayload');


      const response = await authSubmitClaim(samplePayload);
      setTrackingNumber(response.data.claim_number);
      console.log(response, 'response_____');

      // Store claim data in localStorage for demo purposes
      // const claims = JSON.parse(localStorage.getItem('claims') || '[]');
      // const newClaim = {
      //   ...formData,
      //   id: `CLM${String(claims.length + 1).padStart(3, '0')}`,
      //   status: 'SUBMITTED',
      //   submittedAt: new Date().toISOString(),
      //   updatedAt: new Date().toISOString(),
      //   history: [
      //     {
      //       date: new Date().toISOString(),
      //       status: 'SUBMITTED',
      //       note: 'Claim submitted successfully'
      //     }
      //   ]
      // };
      // claims.push(newClaim);
      // localStorage.setItem('claims', JSON.stringify(claims));

      // Show success screen
      setShowSuccess(true);

      // Wait for 5 seconds before redirecting
      setTimeout(() => {
        router.push('/portal/dashboard');
      }, 5000);
    } catch (error) {
      console.error('Error submitting claim:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = async (docId: string, file: File | null) => {
    try {
      if (!file) {
        // If no file is provided, just update the state
        setFormData({
          ...formData, documents: formData.documents.map(doc =>
            doc.id === docId ? { ...doc, file: null } : doc
          )
        })


        setImageURL(prev => prev.filter((doc: any) => doc.id !== docId));
        return;
      }
      setUploading(true);

      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('document_type', formData.documents.find(doc => doc.id === docId)?.name || '');

      const response = await uploadDocument(uploadFormData);
      const responseData = response as unknown as UploadDocumentResponse;
      console.log(responseData.image_url, 'response');
      const checkImageURL = imageURL.find((doc: any) => doc.id === docId);
      if (checkImageURL) {
        setImageURL(prev => prev.map((doc: any) =>
          doc.id === docId ? { ...doc, file: responseData.image_url, name: file.name, id: docId } : doc
        ));
      } else {
        setImageURL([...imageURL, { id: docId, file: responseData.image_url, name: file.name }]);
      }

      setFormData({
        ...formData, documents: formData.documents.map(doc =>
          doc.id === docId ? { ...doc, file } : doc
        )
      })
      showToast('File uploaded successfully', 'success');
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to upload file. Please try again.', 'error');
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleFileClick = (id: string) => {
    console.log(id, 'id');
    const findFile = imageURL.find((doc: any) => doc.id === id);
    if (findFile) {
      window.open(findFile?.file, '_blank');
    } else {
      showToast('File not uploaded', 'error');
    }
  }

  if (showSuccess) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircleIcon className="w-10 h-10 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Claim Submitted Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Your claim has been submitted and is being processed. You will be redirected to your claims dashboard in a few seconds.
            </p>
            <div className="text-sm text-gray-500">
              Claim ID: {trackingNumber}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-200 -z-10"></div>
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex items-center justify-center w-8 h-8 rounded-full ${step <= currentStep ? 'bg-[#004D40] text-white' : 'bg-gray-200 text-gray-500'
                  }`}
              >
                {step < currentStep ? (
                  <CheckCircleIcon className="w-5 h-5" />
                ) : (
                  <span>{step}</span>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-sm font-medium">Claim Type</span>
            <span className="text-sm font-medium">Details</span>
            <span className="text-sm font-medium">Documents</span>
            <span className="text-sm font-medium">Review</span>
          </div>
        </div>

        {/* Step 1: Claim Type */}
        {currentStep === 1 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Select Claim Type</h2>
            {claimTypesLoading ? (
              <div className="flex items-center justify-center py-8">
                <svg className="animate-spin h-8 w-8 text-[#004D40]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="ml-3 text-gray-600">Loading claim types...</span>
              </div>
            ) : (
              <div className="grid gap-4">
                {claimTypesData?.map((type) => (
                  <label
                    key={type.id}
                    className={`flex items-start p-4 border rounded-xl cursor-pointer transition-colors ${formData.type === type.id?.toString()
                      ? 'border-[#004D40] bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <input
                      type="radio"
                      name="claimType"
                      value={type.id?.toString()}
                      checked={formData.type === type.id?.toString()}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as ClaimType })}
                      className="sr-only"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{type.name}</div>
                      <div className="text-sm text-gray-500 mt-1">{type.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Claim Details */}
        {currentStep === 2 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Claim Details</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Insurance Provider
                </label>
                <select
                  value={formData.insuranceProvider}
                  onChange={(e) => setFormData({ ...formData, insuranceProvider: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
                >
                  <option value="">Select Insurance Provider</option>
                  {insurers?.map((provider: Insurer) => (
                    <option key={provider.id} value={provider.name}>
                      {provider.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Incident Type
                </label>
                <select
                  value={formData.incidentType}
                  onChange={(e) => setFormData({ ...formData, incidentType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
                >
                  <option value="">Select Incident Type</option>
                  {incidentTypes?.map((type) => (
                    <option key={type.id} value={type.name}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Incident Date
                  </label>
                  <input
                    type="date"
                    value={formData.incidentDate}
                    onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Incident Time
                  </label>
                  <input
                    type="time"
                    value={formData.incidentTime}
                    onChange={(e) => setFormData({ ...formData, incidentTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Incident Location
                </label>
                <input
                  type="text"
                  value={formData.incidentLocation}
                  onChange={(e) => setFormData({ ...formData, incidentLocation: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
                  placeholder="Enter the location where the incident occurred"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description of Incident
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
                  placeholder="Please provide detailed description of the incident..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Policy Number (Optional)
                </label>
                <input
                  type="text"
                  value={formData.policyNumber}
                  onChange={(e) => setFormData({ ...formData, policyNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
                  placeholder="Enter your policy number if available"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Documents */}
        {currentStep === 3 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Upload Documents</h2>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-600">All documents are required unless skipped</p>
              <button
                onClick={() => setSkipDocuments(!skipDocuments)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${skipDocuments
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {skipDocuments ? 'Resume Upload' : 'Skip All Documents'}
              </button>
            </div>
            {uploading && <div className='flex items-center gap-2 mb-4'>
              <svg className="animate-spin h-5 w-5 text-[#004D40]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </div>}
            <div className={`space-y-6 ${skipDocuments ? 'opacity-50 pointer-events-none' : ''}`}>
              {formData.documents.map((doc) => (
                <div key={doc.id} className="space-y-2">

                  <h4 className="font-medium text-gray-900">{doc.name}</h4>
                  {!doc.file ? (
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#004D40] transition-colors cursor-pointer"
                      onClick={() => document.getElementById(`file-${doc.id}`)?.click()}
                    >
                      <ArrowUpTrayIcon className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-600 mb-1">
                        Drag and drop your file here, or click to browse
                      </p>
                      <p className="text-xs text-gray-500">
                        Maximum file size: 10MB
                      </p>

                      <input
                        type="file"
                        id={`file-${doc.id}`}
                        className="hidden"
                        onChange={(e) => handleFileChange(doc.id, e.target.files?.[0] || null)}
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <DocumentTextIcon className="w-5 h-5 text-[#004D40]" />
                          <span className="text-sm text-gray-600">{doc?.file?.name}</span>
                        </div>
                        <button
                          onClick={() => handleFileChange(doc.id, null)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <XMarkIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>
        )}

        {/* Step 4: Review - Updated with comprehensive sections */}
        {currentStep === 4 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Review Your Claim</h2>

            {/* Claim Information Section */}
            <div className="space-y-6">
              <div className="border-b pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Claim Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-sm text-gray-500">Claim Type</span>
                    <span className="block text-base text-gray-900 mt-1">
                      {claimTypesData?.find(type => type.id?.toString() === formData.type)?.name}
                    </span>
                  </div>
                  <div>
                    <span className="block text-sm text-gray-500">Insurance Provider</span>
                    <span className="block text-base text-gray-900 mt-1">
                      {formData.insuranceProvider || 'Not specified'}
                    </span>
                  </div>
                  <div>
                    <span className="block text-sm text-gray-500">Policy Number</span>
                    <span className="block text-base text-gray-900 mt-1">
                      {formData.policyNumber || 'Not provided'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Incident Details Section */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Incident Details</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="block text-sm text-gray-500">Incident Type</span>
                    <span className="block text-base text-gray-900 mt-1">
                      {formData.incidentType}
                    </span>
                  </div>
                  <div>
                    <span className="block text-sm text-gray-500">Date & Time</span>
                    <span className="block text-base text-gray-900 mt-1">
                      {new Date(`${formData.incidentDate}T${formData.incidentTime}`).toLocaleString('en-GB', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="block text-sm text-gray-500">Location</span>
                    <span className="block text-base text-gray-900 mt-1">
                      {formData.incidentLocation || 'Not specified'}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="block text-sm text-gray-500">Description</span>
                  <span className="block text-base text-gray-900 mt-1 whitespace-pre-wrap">
                    {formData.description || 'No description provided'}
                  </span>
                </div>
              </div>

              {/* Documents Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Supporting Documents</h3>
                {formData.documents.length > 0 && !skipDocuments ? (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <ul className="space-y-3">
                      {formData.documents.map((file, index) => (
                        <li onClick={() => handleFileClick(file.id)} key={index} className="flex items-center gap-3 text-gray-700 cursor-pointer">
                          <DocumentTextIcon className="w-5 h-5 text-gray-500" />
                          <div>
                            <span className="font-medium">{file.name}</span>
                            <span className="text-sm text-gray-500 ml-2">
                              {/* ({(file.size / 1024 / 1024).toFixed(2)} MB) */}
                              1mb
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-gray-500">No documents uploaded</p>
                )}
              </div>

              {/* Confirmation Notice */}
              <div className="mt-6 bg-yellow-50 border border-yellow-100 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  Please review all information carefully before submitting. Once submitted, you'll receive a confirmation email with your claim reference number.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between">
          {currentStep > 1 && (
            <button
              onClick={handleBack}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors disabled:opacity-50"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Back
            </button>
          )}
          {currentStep < 4 ? (
            <div className='flex items-center gap-2'>
              {currentStep === 3 && (
                <button
                  onClick={() => setSkipDocuments(!skipDocuments)}
                  className={`px-4 border border-gray-300 py-2 rounded-xl text-sm font-medium transition-colors ${skipDocuments
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {skipDocuments ? 'Resume Upload' : 'Skip All Documents'}
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={isSubmitting || (currentStep === 3 && !skipDocuments && !formData.documents.every(doc => doc.file))}
                className="flex items-center gap-2 px-6 py-2 bg-[#004D40] text-white rounded-xl hover:bg-[#003D30] transition-colors ml-auto disabled:opacity-50"
              >
                Next
                <ArrowRightIcon className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2 bg-[#004D40] text-white rounded-xl hover:bg-[#003D30] transition-colors ml-auto disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  Submit Claim
                  <CheckCircleIcon className="w-5 h-5" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </main>
  );
} 