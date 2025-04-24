'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DocumentTextIcon, XMarkIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';

interface Document {
  id: string;
  name: string;
  file: File | null;
}

export default function DocumentUpload() {
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [additionalDocs, setAdditionalDocs] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user has completed previous steps
    const basicInfo = localStorage.getItem('basicInfo');
    if (!basicInfo) {
      router.push('/submit-claim/basic-info');
      return;
    }

    // Load required documents based on claim type
    const requiredDocs = JSON.parse(localStorage.getItem('documents') || '[]');
    if (requiredDocs.length > 0) {
      setDocuments(requiredDocs.map((doc: any) => ({
        id: doc.id,
        name: doc.name,
        file: null
      })));
    }
  }, [router]);

  const handleFileChange = (docId: string, file: File | null) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === docId ? { ...doc, file } : doc
    ));
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
    setLoading(true);
    try {
      // Generate tracking number (in real app, this would come from the backend)
      const trackingNumber = 'BC' + Date.now().toString().slice(-8);
      
      // Store submission details
      const submissionDetails = {
        trackingNumber,
        submissionDate: new Date().toISOString(),
        basicInfo: JSON.parse(localStorage.getItem('basicInfo') || '{}'),
        personalInfo: JSON.parse(localStorage.getItem('personalInfo') || '{}'),
        documents: documents.map(doc => ({ id: doc.id, name: doc.name })),
        additionalDocuments: additionalDocs.map(file => file.name)
      };
      
      localStorage.setItem('submissionDetails', JSON.stringify(submissionDetails));
      
      // In a real app, you would upload files to server here
      // await uploadFiles(documents, additionalDocs);
      
      router.push('/submit-claim/success');
    } catch (error) {
      console.error('Error submitting claim:', error);
      // Handle error appropriately
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Upload Documents</h2>
        <p className="text-gray-600 mb-6">
          Please upload the required documents for your claim. You can also add any supporting documents.
        </p>

        {/* Required Documents */}
        <div className="space-y-6 mb-8">
          <h3 className="font-medium text-gray-900">Required Documents</h3>
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
                        <span className="text-sm text-gray-600">{doc.file.name}</span>
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
          <h3 className="font-medium text-gray-900">Supporting Documents</h3>
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
          {loading ? 'Submitting...' : 'Submit Claim'}
        </button>
      </div>
    </div>
  );
} 