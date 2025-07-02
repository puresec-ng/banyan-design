'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  HomeIcon,
  BuildingStorefrontIcon as TreeIcon,
  TruckIcon,
  DevicePhoneMobileIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';
import { getClaimTypes } from '../services/public';
import { useQuery } from "@tanstack/react-query";
import { useToast } from '../context/ToastContext';


export default function ClaimTypeSelection() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [claimTypes, setClaimTypes] = useState<any[]>([]);
  const { showToast } = useToast();

  const { data: claimTypesData } = useQuery({
    queryKey: ['claimTypes'],
    queryFn: getClaimTypes,
  });

  const getIconForClaimType = (code: string) => {
    switch (code) {
      case 'MOTOR':
        return TruckIcon;
      case 'HOME':
        return HomeIcon;
      case 'PROPERTY':
        return HomeIcon;
      case 'SME':
        return BuildingOfficeIcon;
      case 'LIABILITY':
        return ShieldCheckIcon;
      case 'COMMERCIAL':
        return TreeIcon;
      case 'GADGET':
        return DevicePhoneMobileIcon;
      default:
        return QuestionMarkCircleIcon;
    }
  };

  useEffect(() => {
    // Migration: Remove invalid selectedClaimType values
    const claimTypeId = localStorage.getItem('selectedClaimType');
    if (claimTypeId && (claimTypeId === '{}' || claimTypeId === '[object Object]')) {
      localStorage.removeItem('selectedClaimType');
    }
    // Clear all claim-related data when starting a new claim
    localStorage.removeItem('personalInfo');
    localStorage.removeItem('basicInfo');
    localStorage.removeItem('selectedClaimType');
    localStorage.removeItem('documents');
    localStorage.removeItem('submissionDetails');
    localStorage.removeItem('claimNumber');
    // Optionally clear any other claim-related keys here
    if (claimTypesData) {
      const formattedClaimTypes = claimTypesData.map(type => ({
        id: type.id.toString(),
        title: type.name,
        description: type.description,
        icon: getIconForClaimType(type.code),
        code: type.code,
        tracking_prefix: type.tracking_prefix,
        required_documents: JSON.parse(type.required_documents),
        processing_time_estimate: type.processing_time_estimate
      }));
      setClaimTypes(formattedClaimTypes);
    }
  }, [claimTypesData]);

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId);
    localStorage.setItem('selectedClaimType', typeId.toString());
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
              className={`p-6 rounded-xl border-2 transition-all duration-200 ${selectedType === type.id
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