'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  DocumentTextIcon,
  PhotoIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ClockIcon,
  CalendarIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import {
  getAdditionalInfoRequest,
  submitAdditionalInfoResponse,
  AdditionalInfoRequest as AdditionalInfoRequestType,
  FormField,
  DocumentRequest,
  SubmitAdditionalInfoPayload,
} from '../services/claims';
import { uploadDocument } from '../services/public';
import { useToast } from '../context/ToastContext';
import { useApiError } from '../utils/http';

interface AdditionalInfoRequestProps {
  claimId: string;
  requestType: 'document_request' | 'additional_information';
  onComplete?: () => void;
}

export default function AdditionalInfoRequestComponent({
  claimId,
  requestType,
  onComplete,
}: AdditionalInfoRequestProps) {
  const { showToast } = useToast();
  const { handleApiError } = useApiError();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [uploadedDocuments, setUploadedDocuments] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<Record<string, boolean>>({});

  // Fetch the additional information request
  const { data: requestData, isLoading, error } = useQuery({
    queryKey: ['additionalInfoRequest', claimId, requestType],
    queryFn: () => getAdditionalInfoRequest(claimId, requestType),
    enabled: !!claimId,
  });

  // Submit response mutation
  const submitMutation = useMutation({
    mutationFn: submitAdditionalInfoResponse,
    onSuccess: () => {
      showToast('Information submitted successfully!', 'success');
      // Invalidate both query keys to refresh data on all pages
      queryClient.invalidateQueries({ queryKey: ['additionalInfoRequest'] });
      queryClient.invalidateQueries({ queryKey: ['all-requests'] });
      onComplete?.();
    },
    onError: (error) => {
      const errorMessage = handleApiError(error);
      showToast(errorMessage, 'error');
    },
  });

  // Handle form field changes
  const handleFieldChange = (fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  // Handle file upload
  const handleFileUpload = async (documentId: string, file: File) => {
    if (!requestData?.data) return;

    setUploadingFiles(prev => ({ ...prev, [documentId]: true }));

    try {
      // Upload file to get URL
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadResponse = await uploadDocument(formData);
      const fileUrl = uploadResponse.data?.image_url || uploadResponse.data?.file_url;

      if (fileUrl) {
        setUploadedDocuments(prev => ({ ...prev, [documentId]: fileUrl }));
        showToast('File uploaded successfully!', 'success');
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      showToast(errorMessage, 'error');
    } finally {
      setUploadingFiles(prev => ({ ...prev, [documentId]: false }));
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!requestData?.data) return;

    setIsSubmitting(true);

    try {
      const responses = Object.entries(formData).map(([fieldId, value]) => ({
        fieldId,
        value,
      }));

      const documents = Object.entries(uploadedDocuments).map(([documentId, fileUrl]) => ({
        documentId,
        fileUrl,
      }));

      const payload: SubmitAdditionalInfoPayload = {
        requestId: requestData.data.id,
        responses,
        documents,
      };

      await submitMutation.mutateAsync(payload);
    } catch (error) {
      // Error handling is done in the mutation
    } finally {
      setIsSubmitting(false);
    }
  };

  // Validate form
  const isFormValid = () => {
    if (!requestData?.data) return false;

    const { fields = [], documents = [] } = requestData.data;

    // Check required fields
    const requiredFields = fields.filter(field => field.required);
    const requiredFieldsFilled = requiredFields.every(field => 
      formData[field.id] && formData[field.id].trim() !== ''
    );

    // Check required documents
    const requiredDocuments = documents.filter(doc => doc.required);
    const requiredDocumentsUploaded = requiredDocuments.every(doc => 
      uploadedDocuments[doc.id]
    );

    return requiredFieldsFilled && requiredDocumentsUploaded;
  };

  // Get status color
  const getStatusColor = (status?: string) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  // Get priority color
  const getPriorityColor = (priority?: string) => {
    if (!priority) return 'bg-gray-100 text-gray-800';
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading request...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <ExclamationCircleIcon className="h-6 w-6 text-red-600 mr-2" />
          <div>
            <h3 className="text-red-800 font-medium">Error Loading Request</h3>
            <p className="text-red-600 text-sm mt-1">
              {handleApiError(error)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!requestData?.data) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <div className="flex items-center">
          <InformationCircleIcon className="h-6 w-6 text-gray-600 mr-2" />
          <div>
            <h3 className="text-gray-800 font-medium">No Request Found</h3>
            <p className="text-gray-600 text-sm mt-1">
              No {requestType === 'document_request' ? 'document request' : 'additional information request'} found for this claim.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const request = requestData.data;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-xl font-semibold text-gray-900">
                {request.title}
              </h2>
              {request.status && (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                  {request.status.toUpperCase()}
                </span>
              )}
              {request.priority && (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(request.priority)}`}>
                  {request.priority.toUpperCase()} PRIORITY
                </span>
              )}
            </div>
            <p className="text-gray-600 text-sm mb-3">{request.description}</p>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                Created: {new Date(request.createdAt).toLocaleString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}
              </div>
              {request.dueDate && (
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  Due: {new Date(request.dueDate).toLocaleString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Form Fields */}
        {request.fields && request.fields.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Information Required</h3>
            <div className="space-y-4">
              {request.fields.map((field: FormField) => (
                <div key={field.id}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  
                  {field.type === 'textarea' ? (
                    <textarea
                      value={formData[field.id] || ''}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required={field.required}
                    />
                  ) : field.type === 'select' ? (
                    <select
                      value={formData[field.id] || ''}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required={field.required}
                    >
                      <option value="">Select an option</option>
                      {field.options?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : field.type === 'checkbox' ? (
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData[field.id] === 'true'}
                        onChange={(e) => handleFieldChange(field.id, e.target.checked.toString())}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{field.label}</span>
                    </div>
                  ) : (
                    <input
                      type={field.type}
                      value={formData[field.id] || ''}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required={field.required}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Document Upload */}
        {request.documents && request.documents.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Documents Required</h3>
            <div className="space-y-4">
              {request.documents.map((doc: DocumentRequest) => (
                <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{doc.name}</h4>
                      {doc.description && (
                        <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                      )}
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>Type: {doc.type}</span>
                        <span>Max size: {doc.maxSize}MB</span>
                        <span>Formats: {doc.acceptedFormats.join(', ')}</span>
                        {doc.required && (
                          <span className="text-red-500 font-medium">Required</span>
                        )}
                      </div>
                    </div>
                    {uploadedDocuments[doc.id] && (
                      <div className="flex items-center text-green-600">
                        <CheckCircleIcon className="h-5 w-5 mr-1" />
                        <span className="text-sm font-medium">Uploaded</span>
                      </div>
                    )}
                  </div>

                  {!uploadedDocuments[doc.id] && (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                      <div className="text-center">
                        <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4">
                          <label className="cursor-pointer">
                            <span className="mt-2 block text-sm font-medium text-gray-900">
                              Upload {doc.name}
                            </span>
                            <input
                              type="file"
                              className="sr-only"
                              accept={doc.acceptedFormats.map(format => `.${format}`).join(',')}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  if (file.size > doc.maxSize * 1024 * 1024) {
                                    showToast(`File size must be less than ${doc.maxSize}MB`, 'error');
                                    return;
                                  }
                                  handleFileUpload(doc.id, file);
                                }
                              }}
                              disabled={uploadingFiles[doc.id]}
                            />
                          </label>
                          <p className="mt-1 text-xs text-gray-500">
                            Accepted formats: {doc.acceptedFormats.join(', ')}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={handleSubmit}
            disabled={!isFormValid() || isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Submitting...
              </>
            ) : (
              'Submit Response'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
