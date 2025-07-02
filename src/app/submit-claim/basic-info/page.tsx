'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getInsurers, Insurer, getIncidentTypes, IncidentType } from '../../services/public';
import { useQuery } from "@tanstack/react-query";
import { useToast } from '../../context/ToastContext';
import Image from 'next/image';

export default function BasicInfo() {
  const router = useRouter();
  const { data: insurers, isLoading, error } = useQuery({
    queryKey: ['insurers'],
    queryFn: getInsurers,
  });

  const { data: incidentTypes } = useQuery<IncidentType[]>({
    queryKey: ['incidentTypes'],
    queryFn: getIncidentTypes,
  });

  const { showToast } = useToast();

  useEffect(() => {
    if (insurers) {
      console.log('Insurers data:', insurers);
    }
    if (incidentTypes) {
      console.log('Incident Types data:', incidentTypes);
    }
  }, [insurers, incidentTypes]);

  const initialFormData = {
    insuranceProvider: '',
    incidentType: '',
    incidentDate: '',
    incidentTime: '',
    incidentLocation: '',
    incidentDescription: '',
    policyNumber: ''
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    // Check if user has completed previous steps
    const selectedType = localStorage.getItem('selectedClaimType');
    if (!selectedType && window.location.pathname === '/submit-claim/basic-info') {
        // Redirect to claim selection if no claim type is selected
        router.push('/submit-claim');
        return;
    }

    // Load existing basic info if available
    const existingBasicInfo = localStorage.getItem('basicInfo');
    if (existingBasicInfo) {
      try {
        const parsedInfo = JSON.parse(existingBasicInfo);
        setFormData({
          insuranceProvider: parsedInfo.insuranceProvider || '',
          incidentType: parsedInfo.incidentType || '',
          incidentDate: parsedInfo.incidentDate || '',
          incidentTime: parsedInfo.incidentTime || '',
          incidentLocation: parsedInfo.incidentLocation || '',
          incidentDescription: parsedInfo.incidentDescription || '',
          policyNumber: parsedInfo.policyNumber || ''
        });
      } catch (error) {
        console.error('Error parsing existing basic info:', error);
      }
    }

  }, [router]);

  const today = new Date().toISOString().split('T')[0];
  const getCurrentTime = () => {
    const now = new Date();
    return now.toTimeString().slice(0,5);
  };
  const isTimeInFuture = (selectedDate: string, selectedTime: string) => {
    if (selectedDate !== today) return false;
    const now = new Date();
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const selectedDateTime = new Date();
    selectedDateTime.setHours(hours, minutes, 0, 0);
    return selectedDateTime > now;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'incidentTime' && isTimeInFuture(formData.incidentDate, value)) {
      showToast('Cannot select a future time for today', 'error');
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBack = () => {
    router.push('/submit-claim');
  };

  const handleContinue = () => {
    if (isFormValid()) {
      // Final check for future time
      if (isTimeInFuture(formData.incidentDate, formData.incidentTime)) {
        showToast('Cannot select a future time for today', 'error');
        return;
      }
      const insurer = insurers?.find((i: Insurer) => i.name === formData.insuranceProvider);
      const incidentType = incidentTypes?.find((t: IncidentType) => t.name === formData.incidentType);
      localStorage.setItem('basicInfo', JSON.stringify({
        ...formData,
        insurer_id: insurer?.id,
        incident_type: incidentType?.id
      }));
      router.push('/submit-claim/personal-info');
    }
  };

  const isFormValid = () => {
    return (
      formData.insuranceProvider &&
      formData.incidentType &&
      formData.incidentDate &&
      formData.incidentTime &&
      formData.incidentLocation &&
      formData.incidentDescription
    );
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>

        <div className="space-y-6">
          {/* Insurance Provider */}
          <div>
            <label htmlFor="insuranceProvider" className="block text-sm font-medium text-gray-700 mb-1">
              Insurance Provider
            </label>
            <select
              id="insuranceProvider"
              name="insuranceProvider"
              value={formData.insuranceProvider}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
              required
            >
              <option value="">Select Insurance Provider</option>
              {insurers?.map((insurer: Insurer) => (
                <option key={insurer.id} value={insurer.name}>
                  {insurer.name}
                </option>
              ))}
            </select>
            {formData.insuranceProvider && insurers && (
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                {insurers.find((i: Insurer) => i.name === formData.insuranceProvider)?.special_instructions && (
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Special Instructions:</span>{' '}
                    {insurers.find((i: Insurer) => i.name === formData.insuranceProvider)?.special_instructions}
                  </p>
                )}
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Contact:</span>{' '}
                  {insurers.find((i: Insurer) => i.name === formData.insuranceProvider)?.contact_phone}
                </p>
              </div>
            )}
          </div>

          {/* Incident Type */}
          <div>
            <label htmlFor="incidentType" className="block text-sm font-medium text-gray-700 mb-1">
              Incident Type
            </label>
            <select
              id="incidentType"
              name="incidentType"
              value={formData.incidentType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
              required
            >
              <option value="">Select Incident Type</option>
              {incidentTypes?.map((type) => (
                <option key={type.id} value={type.name}>
                  {type.name}
                </option>
              ))}
            </select>
            {formData.incidentType && incidentTypes && (
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Description:</span>{' '}
                  {incidentTypes.find((t) => t.name === formData.incidentType)?.description}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Required Documents:</span>{' '}
                  {JSON.parse(incidentTypes.find((t) => t.name === formData.incidentType)?.required_documents || '[]').join(', ')}
                </p>
              </div>
            )}
          </div>

          {/* Incident Date */}
          <div>
            <label htmlFor="incidentDate" className="block text-sm font-medium text-gray-700 mb-1">
              Incident Date
            </label>
            <input
              type="date"
              id="incidentDate"
              name="incidentDate"
              value={formData.incidentDate}
              onChange={handleChange}
              max={today}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
              required
            />
          </div>

          {/* Incident Time */}
          <div>
            <label htmlFor="incidentTime" className="block text-sm font-medium text-gray-700 mb-1">
              Incident Time
            </label>
            <input
              type="time"
              id="incidentTime"
              name="incidentTime"
              value={formData.incidentTime}
              onChange={handleChange}
              max={formData.incidentDate === today ? getCurrentTime() : undefined}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
              required
            />
          </div>

          {/* Incident Location */}
          <div>
            <label htmlFor="incidentLocation" className="block text-sm font-medium text-gray-700 mb-1">
              Incident Location
            </label>
            <input
              type="text"
              id="incidentLocation"
              name="incidentLocation"
              value={formData.incidentLocation}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
              placeholder="Enter the location where the incident occurred"
              required
            />
          </div>

          {/* Incident Description */}
          <div>
            <label htmlFor="incidentDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Incident Description
            </label>
            <textarea
              id="incidentDescription"
              name="incidentDescription"
              value={formData.incidentDescription}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
              placeholder="Please provide a detailed description of the incident"
              required
            />
          </div>

          {/* Policy Number */}
          <div>
            <label htmlFor="policyNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Policy Number (Optional)
            </label>
            <input
              type="text"
              id="policyNumber"
              name="policyNumber"
              value={formData.policyNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
              placeholder="Enter your policy number if available"
            />
          </div>
        </div>
      </form>

      {/* Navigation Buttons */}
      <div className="mt-8 flex justify-between">
        <button
          onClick={handleBack}
          className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          disabled={!isFormValid()}
          className="px-6 py-2 bg-[#004D40] text-white rounded-lg hover:bg-[#003D30] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
} 