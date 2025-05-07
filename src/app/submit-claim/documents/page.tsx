'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DocumentTextIcon, XMarkIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { IncidentType, getIncidentTypes, uploadDocument, submitClaim } from '@/app/services/public';
import { useQuery } from "@tanstack/react-query";
import { useToast } from '../../context/ToastContext';

interface Document {
  id: string;
  name: string;
  file: File | null;
}

interface UploadedDocument {
  id: string;
  name: string;
  file: string;
}

interface UploadDocumentResponse {
  image_url: string;
}

export default function DocumentUpload() {
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [additionalDocs, setAdditionalDocs] = useState<File[]>([]);
  const [imageURL, setImageURL] = useState<UploadedDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { showToast } = useToast();
  const { data: incidentTypes } = useQuery<IncidentType[]>({
    queryKey: ['incidentTypes'],
    queryFn: getIncidentTypes,
  });

  useEffect(() => {
    console.log("came here_____");

    // Check if user has completed previous steps
    const basicInfo = localStorage.getItem('basicInfo');
    const personalInfo = localStorage.getItem('personalInfo');

    if (!basicInfo) {
      router.push('/submit-claim/basic-info');
      return;
    }
    if (!personalInfo) {
      router.push('/submit-claim/personal-info');
      return;
    }

    // Load required documents based on claim type
    const { incidentType } = JSON.parse(basicInfo);
    if (incidentType && incidentTypes) {
      console.log("got here_____");
      console.log("got here_____");
      console.log("got here_____");
      console.log("got here_____");
      console.log("got here_____");

      const selectedIncidentType = incidentTypes.find(t => t.name === incidentType);
      console.log(selectedIncidentType, 'selectedIncidentType');
      if (selectedIncidentType) {
        setDocuments(JSON.parse(selectedIncidentType?.required_documents || '[]').map((doc: any, index: number) => ({
          id: index,
          name: doc,
        })));
      }
    }

  }, [router, incidentTypes]);

  const handleFileChange = async (docId: string, file: File | null) => {
    try {
      if (!file) {
        // If no file is provided, just update the state
        setDocuments(prev => prev.map(doc =>
          doc.id === docId ? { ...doc, file: null } : doc
        ));
        setImageURL(prev => prev.filter((doc: any) => doc.id !== docId));
        return;
      }
      setUploading(true);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('document_type', documents.find(doc => doc.id === docId)?.name || '');
      formData.append('claim_number', localStorage.getItem('claimNumber') || '');

      const response = await uploadDocument(formData);
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

      setDocuments(prev => prev.map((doc: any) =>
        doc.id === docId ? { ...doc, file } : doc
      ));
      showToast('File uploaded successfully', 'success');
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to upload file. Please try again.', 'error');
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleAdditionalFiles = (files: FileList | null) => {
    if (files) {
      setAdditionalDocs(prev => [...prev, ...Array.from(files)]);
    }
  };

  const removeAdditionalFile = (index: number) => {
    setAdditionalDocs(prev => prev.filter((_, i) => i !== index));
  };

  const handleBack = () => {
    router.push('/submit-claim/requirements');
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      console.log("got here");


      const personalInfo = JSON.parse(localStorage.getItem('personalInfo') || '{}');
      const basicInfo = JSON.parse(localStorage.getItem('basicInfo') || '{}');
      const selectedClaimType = JSON.parse(localStorage.getItem('selectedClaimType') || '{}');
      const samplePayload = {
        first_name: personalInfo.firstName,
        last_name: personalInfo.lastName,
        phone: personalInfo.phoneNumber,
        email: personalInfo.email,
        claim_type: selectedClaimType,
        incident_type: basicInfo.incident_type,
        incident_date: `${basicInfo.incidentDate} ${basicInfo.incidentTime}:00`,
        incident_location: basicInfo.incidentLocation,
        description: basicInfo.incidentDescription,
        policy_number: basicInfo.policyNumber,
        insurer_id: basicInfo.insurer_id,
        payment_model: 1,
        file_url: imageURL.map((doc: any) => doc.file)
      }


      // Submit the claim
      const response = await submitClaim(samplePayload);
      console.log(response, 'response_____');
      const getSubmissionDetails = await localStorage.getItem('submissionDetails');
      localStorage.setItem('submissionDetails', JSON.stringify({
        ...JSON.parse(getSubmissionDetails || '{}'),
        trackingNumber: response.data.claim_number
      }));

      // Store empty documents array to indicate user skipped
      localStorage.setItem('documents', JSON.stringify([]));
      showToast('Claim submitted successfully', 'success');
      emptyStoredData();

      // Navigate to success page
      router.push('/submit-claim/success');

    } catch (error) {
      console.error('Error submitting claim:', error);
      showToast('Failed to submit claim. Please try again.', 'error');
      // Handle error appropriately
    } finally {
      setLoading(false);
    }
  };

  const emptyStoredData = () => {
    localStorage.removeItem('personalInfo');
    localStorage.removeItem('basicInfo');
    localStorage.removeItem('selectedClaimType');
    setDocuments([]);
    setAdditionalDocs([]);
    setImageURL([]);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Upload Documents</h2>
        <p className="text-gray-600 mb-6">
          Please upload the required documents for your claim. You can also add any supporting documents.
        </p>
        {uploading && <div className='flex items-center gap-2 mb-4'>
          <svg className="animate-spin h-5 w-5 text-[#004D40]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Uploading...
        </div>}

        {/* Required Documents */}
        <div className="space-y-6 mb-8">
          <div className="space-y-6">
            {documents.map((doc) => (
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

        {/* Supporting Documents */}
        <div className="space-y-4">
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#004D40] transition-colors cursor-pointer"
            onClick={() => document.getElementById('additional-files')?.click()}
          >
            <ArrowUpTrayIcon className="w-8 h-8 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-600 mb-1">
              Drag and drop your files here, or click to browse
            </p>
            <p className="text-xs text-gray-500">
              You can upload multiple files • Maximum file size: 10MB each
            </p>
            <input
              type="file"
              id="additional-files"
              multiple
              className="hidden"
              onChange={(e) => handleAdditionalFiles(e.target.files)}
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </div>

          {/* Display Supporting Files */}
          {additionalDocs.length > 0 && (
            <div className="mt-4 space-y-2">
              {additionalDocs.map((file, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <DocumentTextIcon className="w-5 h-5 text-[#004D40]" />
                      <span className="text-sm text-gray-600">{file.name}</span>
                    </div>
                    <button
                      onClick={() => removeAdditionalFile(index)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-8 flex justify-between">
        <button
          onClick={handleBack}
          className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-6 py-2 bg-[#004D40] text-white rounded-lg hover:bg-[#003D30] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : 'Submit Claim1'}
        </button>
      </div>
    </div>
  );
} 