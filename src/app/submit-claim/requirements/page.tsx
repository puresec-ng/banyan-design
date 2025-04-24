'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, ArrowRightIcon, DocumentTextIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';

const REQUIRED_DOCUMENTS = {
  'motor': [
    { id: 'drivers_license', name: 'Driver\'s License', description: 'Valid driver\'s license of the person operating the vehicle' },
    { id: 'vehicle_registration', name: 'Vehicle Registration', description: 'Current vehicle registration document' },
    { id: 'police_report', name: 'Police Report', description: 'Police report for accidents or theft cases' },
    { id: 'photos', name: 'Incident Photos', description: 'Clear photos showing the damage to the vehicle' }
  ],
  'property': [
    { id: 'property_deed', name: 'Property Deed/Lease', description: 'Document showing ownership or lease of the property' },
    { id: 'damage_photos', name: 'Damage Photos', description: 'Clear photos of the property damage' },
    { id: 'police_report', name: 'Police Report', description: 'For cases of theft or vandalism' },
    { id: 'repair_estimate', name: 'Repair Estimate', description: 'Professional estimate of repair costs' }
  ],
  'business': [
    { id: 'business_license', name: 'Business License', description: 'Valid business registration or license' },
    { id: 'financial_records', name: 'Financial Records', description: 'Relevant financial statements or records' },
    { id: 'incident_report', name: 'Incident Report', description: 'Detailed report of the incident' },
    { id: 'damage_evidence', name: 'Evidence of Loss', description: 'Photos or documentation of business interruption/damage' }
  ],
  'gadget': [
    { id: 'purchase_receipt', name: 'Purchase Receipt', description: 'Original purchase receipt of the device' },
    { id: 'device_photos', name: 'Device Photos', description: 'Photos showing the damage to the device' },
    { id: 'police_report', name: 'Police Report', description: 'For theft cases' }
  ],
  'liability': [
    { id: 'incident_report', name: 'Incident Report', description: 'Detailed description of the incident' },
    { id: 'witness_statements', name: 'Witness Statements', description: 'Statements from any witnesses' },
    { id: 'medical_reports', name: 'Medical Reports', description: 'For cases involving injury' },
    { id: 'damage_evidence', name: 'Evidence of Damage', description: 'Photos or documentation of property damage' }
  ],
  'commercial': [
    { id: 'business_registration', name: 'Business Registration', description: 'Valid business registration documents' },
    { id: 'inventory_records', name: 'Inventory Records', description: 'Records of affected inventory or assets' },
    { id: 'damage_photos', name: 'Damage Photos', description: 'Photos of damaged property or assets' },
    { id: 'financial_documents', name: 'Financial Documents', description: 'Relevant financial statements or invoices' }
  ]
};

export default function DocumentRequirements() {
  const router = useRouter();
  const [claimType, setClaimType] = useState<string>('');
  const [documents, setDocuments] = useState<Array<{ id: string; name: string; description: string }>>([]);

  useEffect(() => {
    // Check if user has completed previous steps
    const personalInfo = localStorage.getItem('personalInfo');
    const selectedType = localStorage.getItem('selectedClaimType');
    
    if (!personalInfo) {
      router.push('/submit-claim/personal-info');
      return;
    }

    if (selectedType) {
      setClaimType(selectedType);
      setDocuments(REQUIRED_DOCUMENTS[selectedType as keyof typeof REQUIRED_DOCUMENTS] || []);
    }
  }, [router]);

  const handleBack = () => {
    router.push('/submit-claim/personal-info');
  };

  const handleContinue = () => {
    router.push('/submit-claim/documents');
  };

  const handleSkip = () => {
    // Store empty documents array to indicate user skipped
    localStorage.setItem('documents', JSON.stringify([]));
    // Submit the claim
    router.push('/submit-claim/success');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Required Documents</h2>
        <p className="text-gray-600 mb-6">
          The following documents are required for your claim. You can upload them now or submit your claim and upload them later.
        </p>

        <div className="space-y-4">
          {documents.map((doc) => (
            <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <DocumentTextIcon className="w-6 h-6 text-[#004D40] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900">{doc.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> You can proceed without uploading documents now and submit them later through your dashboard.
          </p>
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
        <div className="flex gap-3">
          <button
            onClick={handleSkip}
            className="px-6 py-2 text-[#004D40] border border-[#004D40] rounded-lg hover:bg-[#E0F2F1] transition-colors"
          >
            Submit Without Documents
          </button>
          <button
            onClick={handleContinue}
            className="px-6 py-2 bg-[#004D40] text-white rounded-lg hover:bg-[#003D30] transition-colors"
          >
            Upload Documents
          </button>
        </div>
      </div>
    </div>
  );
} 