'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  TruckIcon,
  BuildingOfficeIcon,
  DevicePhoneMobileIcon,
  HomeIcon,
  BuildingStorefrontIcon as TreeIcon,
} from '@heroicons/react/24/outline';

const claimTypes = [
  {
    id: 'MOTOR',
    title: 'Motor Claims',
    description: 'Claims for vehicle damage, accidents, or theft',
    icon: TruckIcon,
  },
  {
    id: 'SME',
    title: 'SME Claims',
    description: 'Business insurance claims for small and medium enterprises',
    icon: BuildingOfficeIcon,
  },
  {
    id: 'GADGET',
    title: 'Gadget Claims',
    description: 'Claims for phones, laptops, and other electronic devices',
    icon: DevicePhoneMobileIcon,
  },
  {
    id: 'HOUSEHOLDER',
    title: 'Householder Claims',
    description: 'Home insurance claims for property damage or theft',
    icon: HomeIcon,
  },
  {
    id: 'AGRO',
    title: 'Agro Claims',
    description: 'Agricultural insurance claims for crops and livestock',
    icon: TreeIcon,
  },
];

export default function ClaimTypeSelection() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleNext = () => {
    if (selectedType) {
      // Save selection to localStorage or state management
      localStorage.setItem('claimType', selectedType);
      router.push('/submit-claim/basic-info');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 font-lato">
          Select Claim Type
        </h1>
        <p className="text-lg text-gray-600 font-roboto">
          Choose the type of claim you'd like to submit
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {claimTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setSelectedType(type.id)}
            className={`relative p-6 rounded-2xl text-left transition-all duration-200 group
              ${selectedType === type.id
                ? 'bg-[#004D40] text-white shadow-lg scale-[1.02]'
                : 'bg-white hover:bg-gray-50 text-gray-900 shadow-md'
              }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-xl
                  ${selectedType === type.id
                    ? 'bg-white/20'
                    : 'bg-[#004D40]/10'
                  }`}
              >
                <type.icon
                  className={`w-6 h-6
                    ${selectedType === type.id
                      ? 'text-white'
                      : 'text-[#004D40]'
                    }`}
                />
              </div>
              <div>
                <h3 className="font-lato font-bold text-lg mb-2">{type.title}</h3>
                <p className={`text-sm font-roboto
                  ${selectedType === type.id
                    ? 'text-white/90'
                    : 'text-gray-600'
                  }`}>
                  {type.description}
                </p>
              </div>
            </div>
            
            {/* Selection Indicator */}
            <div
              className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2
                ${selectedType === type.id
                  ? 'border-white bg-white'
                  : 'border-gray-300 group-hover:border-[#004D40]'
                }`}
            >
              {selectedType === type.id && (
                <svg className="w-full h-full text-[#004D40]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleNext}
          disabled={!selectedType}
          className={`px-6 py-3 rounded-xl font-medium text-white transition-all duration-200
            ${selectedType
              ? 'bg-[#004D40] hover:bg-[#003D30] cursor-pointer'
              : 'bg-gray-300 cursor-not-allowed'
            }`}
        >
          Continue to Basic Information
        </button>
      </div>
    </div>
  );
} 