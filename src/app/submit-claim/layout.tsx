'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const steps = [
  { id: 1, title: 'Claim Type', path: '/submit-claim' },
  { id: 2, title: 'Basic Info', path: '/submit-claim/basic-info' },
  { id: 3, title: 'Personal Info', path: '/submit-claim/personal-info' },
  { id: 4, title: 'Requirements', path: '/submit-claim/requirements' },
  { id: 5, title: 'Documents', path: '/submit-claim/documents' },
];

export default function ClaimSubmissionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  // Update current step based on pathname
  useEffect(() => {
    const step = steps.findIndex(step => step.path === pathname) + 1;
    if (step > 0) setCurrentStep(step);
  }, [pathname]);

  // Simulate auto-save
  useEffect(() => {
    const interval = setInterval(() => {
      setIsSaving(true);
      setTimeout(() => setIsSaving(false), 1000);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Warn user before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <Link href="/" className="relative w-48 h-16">
              <Image
                src="/brand/logo-black.png"
                alt="Banyan Claims Logo"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </Link>
            {isSaving && (
              <span className="text-sm text-gray-600 animate-fade-in-out">
                Saving draft...
              </span>
            )}
          </div>
        </div>
      </nav>

      {/* Progress Tracker */}
      <div className="bg-[#F3F4F6] py-6">
        <div className="container mx-auto px-4">
          <div className="hidden md:flex items-center justify-between max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
                      ${index + 1 < currentStep
                        ? 'bg-[#004D40] border-[#004D40] text-white'
                        : index + 1 === currentStep
                        ? 'border-[#004D40] text-[#004D40] bg-white'
                        : 'border-gray-300 text-gray-400 bg-white'
                    }`}
                  >
                    {index + 1 < currentStep ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="text-xs font-semibold">{step.id}</span>
                    )}
                  </div>
                  <span
                    className={`mt-2 text-sm font-medium
                      ${index + 1 <= currentStep ? 'text-[#004D40]' : 'text-gray-400'}`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-px w-16 mx-2
                      ${index + 1 < currentStep ? 'bg-[#004D40]' : 'bg-gray-300'}`}
                  />
                )}
              </div>
            ))}
          </div>
          
          {/* Mobile Progress Indicator */}
          <div className="md:hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#004D40]">
                Step {currentStep} of {steps.length}
              </span>
              <span className="text-sm font-medium text-[#004D40]">
                {steps[currentStep - 1].title}
              </span>
            </div>
            <div className="h-2 bg-white rounded-full shadow-inner">
              <div
                className="h-full bg-[#004D40] rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </main>
  );
} 