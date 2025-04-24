'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

const paymentModels = [
  {
    id: 'DIRECT',
    title: 'Direct Payment',
    description: 'Get paid directly to your bank account once your claim is approved.',
    benefits: [
      'Fastest payment method',
      'No additional paperwork',
      'Track payment status online',
      'Immediate notification upon payment',
    ],
    recommended: true,
  },
  {
    id: 'REPAIR',
    title: 'Repair Network',
    description: 'We handle the repair through our trusted network of service providers.',
    benefits: [
      'Quality guaranteed repairs',
      'No upfront payment needed',
      'Extended warranty on repairs',
      'Dedicated service manager',
    ],
  },
  {
    id: 'REPLACEMENT',
    title: 'Replacement',
    description: 'We replace your damaged item with an equivalent or better model.',
    benefits: [
      'Brand new replacement',
      'Quick delivery',
      'Installation included',
      'Original warranty preserved',
    ],
  },
];

export default function PaymentModel() {
  const router = useRouter();
  const [selectedModel, setSelectedModel] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Load saved payment model if exists
    const savedModel = localStorage.getItem('paymentModel');
    if (savedModel) {
      setSelectedModel(savedModel);
    }

    // Verify basic info exists
    const basicInfo = localStorage.getItem('basicInfo');
    if (!basicInfo) {
      router.push('/submit-claim/basic-info');
    }
  }, [router]);

  const handleModelSelect = (modelId: string) => {
    setSelectedModel(modelId);
    setError('');
    localStorage.setItem('paymentModel', modelId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModel) {
      setError('Please select a payment model to continue');
      return;
    }
    router.push('/submit-claim/documents');
  };

  const handleBack = () => {
    router.push('/submit-claim/basic-info');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 font-lato">
          Payment Model
        </h1>
        <p className="text-lg text-gray-600 font-roboto">
          Choose how you would like to receive your claim settlement
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {paymentModels.map((model) => (
            <div
              key={model.id}
              className={`relative rounded-2xl border-2 p-6 cursor-pointer transition-all
                ${
                  selectedModel === model.id
                    ? 'border-[#004D40] bg-[#F0F7F5]'
                    : 'border-gray-200 hover:border-gray-300'
                }
              `}
              onClick={() => handleModelSelect(model.id)}
            >
              {model.recommended && (
                <div className="absolute -top-3 left-4 bg-[#E67635] text-white text-sm px-3 py-1 rounded-full">
                  Recommended
                </div>
              )}
              
              <div className="flex items-start gap-4">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex-shrink-0 mt-1
                    ${
                      selectedModel === model.id
                        ? 'border-[#004D40] bg-[#004D40]'
                        : 'border-gray-300'
                    }
                  `}
                >
                  {selectedModel === model.id && (
                    <CheckCircleIcon className="text-white w-5 h-5" />
                  )}
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {model.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {model.description}
                  </p>
                  <ul className="space-y-2">
                    {model.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="w-1.5 h-1.5 bg-[#004D40] rounded-full" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 mt-4">
            <InformationCircleIcon className="w-5 h-5" />
            <p>{error}</p>
          </div>
        )}

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
            Continue to Documents
          </button>
        </div>
      </form>
    </div>
  );
} 