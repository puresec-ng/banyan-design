'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  HomeIcon,
  BuildingStorefrontIcon as TreeIcon,
  TruckIcon,
  DevicePhoneMobileIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

const claimTypes = [
  {
    id: 'motor',
    title: 'Motor Claims',
    description: 'File a claim for vehicle damage, accidents, or theft',
    icon: TruckIcon,
  },
  {
    id: 'property',
    title: 'Property Claims',
    description: 'Claims for home, building, or property damage',
    icon: HomeIcon,
  },
  {
    id: 'business',
    title: 'Business Claims',
    description: 'Claims for business interruption or commercial property',
    icon: BuildingOfficeIcon,
  },
  {
    id: 'gadget',
    title: 'Gadget Claims',
    description: 'Claims for phones, laptops, and other electronic devices',
    icon: DevicePhoneMobileIcon,
  },
  {
    id: 'liability',
    title: 'Liability Claims',
    description: 'Claims related to third-party injuries or property damage',
    icon: ShieldCheckIcon,
  },
  {
    id: 'commercial',
    title: 'Commercial Claims',
    description: 'Claims for commercial properties and assets',
    icon: TreeIcon,
  }
];

export default function ClaimTypeSelection() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId);
    localStorage.setItem('selectedClaimType', typeId);
    router.push('/submit-claim/basic-info');
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center text-[#004D40] hover:text-[#003D30] font-medium"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Return to Website
          </Link>
        </div>

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
              onClick={() => handleTypeSelect(type.id)}
              className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                selectedType === type.id
                  ? 'border-[#004D40] bg-[#E0F2F1]'
                  : 'border-gray-200 hover:border-[#004D40] hover:bg-[#E0F2F1]/50'
              }`}
            >
              <type.icon className="w-12 h-12 text-[#004D40] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {type.title}
              </h3>
              <p className="text-gray-600">
                {type.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
} 