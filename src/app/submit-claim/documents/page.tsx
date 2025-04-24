'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  DocumentIcon, 
  XMarkIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

// Required documents based on claim type
const requiredDocuments = {
  MOTOR: [
    { id: 'DRIVERS_LICENSE', name: 'Driver\'s License', description: 'Valid driver\'s license of the person operating the vehicle' },
    { id: 'POLICE_REPORT', name: 'Police Report', description: 'Official police report if the incident involved an accident' },
    { id: 'VEHICLE_PHOTOS', name: 'Vehicle Photos', description: 'Clear photos showing the damage from multiple angles' },
  ],
  SME: [
    { id: 'BUSINESS_REG', name: 'Business Registration', description: 'Valid business registration certificate' },
    { id: 'DAMAGE_PHOTOS', name: 'Damage Photos', description: 'Clear photos of the damaged property or assets' },
    { id: 'INVENTORY_LIST', name: 'Inventory List', description: 'List of damaged or lost inventory items' },
  ],
  GADGET: [
    { id: 'PURCHASE_RECEIPT', name: 'Purchase Receipt', description: 'Original purchase receipt of the damaged device' },
    { id: 'DEVICE_PHOTOS', name: 'Device Photos', description: 'Clear photos showing the damage to the device' },
    { id: 'REPAIR_QUOTE', name: 'Repair Quote', description: 'Quote from an authorized repair center (if applicable)' },
  ],
  HOUSEHOLDER: [
    { id: 'PROPERTY_DEED', name: 'Property Ownership', description: 'Property deed or rental agreement' },
    { id: 'DAMAGE_PHOTOS', name: 'Damage Photos', description: 'Clear photos of the damaged property' },
    { id: 'POLICE_REPORT', name: 'Police Report', description: 'Police report (required for theft claims)' },
  ],
  AGRO: [
    { id: 'FARM_REG', name: 'Farm Registration', description: 'Farm registration or ownership documents' },
    { id: 'DAMAGE_PHOTOS', name: 'Damage Evidence', description: 'Photos or videos showing crop/livestock damage' },
    { id: 'ASSESSMENT_REPORT', name: 'Assessment Report', description: 'Agricultural expert assessment report' },
  ],
};

interface UploadedFile {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  documentId: string;
}

export default function DocumentUpload() {
  const router = useRouter();
  const [claimType, setClaimType] = useState<keyof typeof requiredDocuments | ''>('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [draggedOver, setDraggedOver] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load claim type and verify previous steps
    const savedType = localStorage.getItem('claimType');
    const paymentModel = localStorage.getItem('paymentModel');
    
    if (!savedType || !paymentModel) {
      router.push('/submit-claim');
      return;
    }
    
    setClaimType(savedType as keyof typeof requiredDocuments);

    // Load any previously uploaded files
    const savedFiles = localStorage.getItem('uploadedDocuments');
    if (savedFiles) {
      setUploadedFiles(JSON.parse(savedFiles));
    }
  }, [router]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDraggedOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDraggedOver(false);
  }, []);

  const validateFile = (file: File, documentId: string) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];

    if (!allowedTypes.includes(file.type)) {
      return 'Only JPG, PNG, and PDF files are allowed';
    }

    if (file.size > maxSize) {
      return 'File size must be less than 10MB';
    }

    if (uploadedFiles.some(f => f.documentId === documentId)) {
      return 'A file has already been uploaded for this document type';
    }

    return null;
  };

  const handleDrop = useCallback((e: React.DragEvent, documentId: string) => {
    e.preventDefault();
    setDraggedOver(false);
    setError('');

    const file = e.dataTransfer.files[0];
    if (!file) return;

    const validationError = validateFile(file, documentId);
    if (validationError) {
      setError(validationError);
      return;
    }

    const newFile: UploadedFile = {
      id: Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      status: 'uploading',
      documentId,
    };

    setUploadedFiles(prev => [...prev, newFile]);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadedFiles(prev => {
        const fileIndex = prev.findIndex(f => f.id === newFile.id);
        if (fileIndex === -1) return prev;

        const updatedFiles = [...prev];
        if (updatedFiles[fileIndex].progress < 100) {
          updatedFiles[fileIndex].progress += 10;
        } else {
          updatedFiles[fileIndex].status = 'completed';
          clearInterval(interval);
        }
        return updatedFiles;
      });
    }, 300);
  }, [uploadedFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>, documentId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file, documentId);
    if (validationError) {
      setError(validationError);
      return;
    }

    const newFile: UploadedFile = {
      id: Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      status: 'uploading',
      documentId,
    };

    setUploadedFiles(prev => [...prev, newFile]);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadedFiles(prev => {
        const fileIndex = prev.findIndex(f => f.id === newFile.id);
        if (fileIndex === -1) return prev;

        const updatedFiles = [...prev];
        if (updatedFiles[fileIndex].progress < 100) {
          updatedFiles[fileIndex].progress += 10;
        } else {
          updatedFiles[fileIndex].status = 'completed';
          clearInterval(interval);
        }
        return updatedFiles;
      });
    }, 300);
  }, []);

  const removeFile = useCallback((fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimType) return;

    const requiredCount = requiredDocuments[claimType].length;
    const uploadedCount = uploadedFiles.filter(f => f.status === 'completed').length;

    if (uploadedCount < requiredCount) {
      setError('Please upload all required documents before proceeding');
      return;
    }

    localStorage.setItem('uploadedDocuments', JSON.stringify(uploadedFiles));
    router.push('/submit-claim/review');
  };

  const handleBack = () => {
    router.push('/submit-claim/payment');
  };

  if (!claimType) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 font-lato">
          Required Documents
        </h1>
        <p className="text-lg text-gray-600 font-roboto">
          Please upload the following documents to process your claim
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 rounded-xl flex items-center gap-3 text-red-700">
          <ExclamationCircleIcon className="w-5 h-5" />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {requiredDocuments[claimType].map((doc) => {
          const uploadedFile = uploadedFiles.find(f => f.documentId === doc.id);
          
          return (
            <div
              key={doc.id}
              className={`border-2 rounded-xl p-6 transition-colors
                ${draggedOver ? 'border-[#004D40] bg-[#F0F7F5]' : 'border-gray-200'}
              `}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, doc.id)}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#004D40]/10 rounded-xl">
                  <DocumentIcon className="w-6 h-6 text-[#004D40]" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {doc.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {doc.description}
                  </p>

                  {uploadedFile ? (
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            {uploadedFile.file.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFile(uploadedFile.id)}
                            className="text-gray-400 hover:text-gray-500"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-full bg-[#004D40] rounded-full transition-all duration-300"
                            style={{ width: `${uploadedFile.progress}%` }}
                          />
                        </div>
                      </div>
                      {uploadedFile.status === 'completed' && (
                        <CheckCircleIcon className="w-6 h-6 text-green-500" />
                      )}
                    </div>
                  ) : (
                    <div>
                      <label
                        htmlFor={`file-${doc.id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-[#004D40] text-[#004D40] rounded-lg hover:bg-[#F0F7F5] cursor-pointer transition-colors"
                      >
                        <ArrowUpTrayIcon className="w-5 h-5" />
                        <span>Choose File</span>
                      </label>
                      <input
                        type="file"
                        id={`file-${doc.id}`}
                        className="hidden"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={(e) => handleFileSelect(e, doc.id)}
                      />
                      <p className="mt-2 text-sm text-gray-500">
                        or drag and drop here
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        <div className="flex justify-between pt-8">
          <button
            type="button"
            onClick={handleBack}
            className="px-6 py-3 text-[#004D40] font-medium hover:bg-gray-50 rounded-xl transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-[#004D40] text-white font-medium rounded-xl hover:bg-[#003D30] transition-colors"
          >
            Review Claim
          </button>
        </div>
      </form>
    </div>
  );
} 