'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PhoneIcon, ChatBubbleLeftRightIcon, EnvelopeIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

// Add FAQ data
const faqs = [
  {
    question: "How do I file a new claim?",
    answer: "To file a new claim, go to the 'New Claims' section in your dashboard. Click on 'File New Claim' and follow the step-by-step process to submit your claim details, including the incident description, supporting documents, and any other required information."
  },
  {
    question: "How long does it take to process a claim?",
    answer: "The processing time varies depending on the type of claim and the complexity of the case. Generally, simple claims are processed within 5-7 business days, while more complex cases may take up to 14 business days. You can track your claim status in the 'Track Claims' section."
  },
  {
    question: "What documents do I need to submit with my claim?",
    answer: "Required documents vary by claim type but typically include: valid ID, proof of ownership, incident report, medical reports (for health claims), police report (if applicable), and any other relevant supporting documents. Specific requirements will be listed during the claim submission process."
  },
  {
    question: "How do I check my claim status?",
    answer: "You can check your claim status by going to the 'Track Claims' section in your dashboard. Here you'll see a list of all your claims with their current status, including any updates or actions required from your side."
  },
  {
    question: "What payment methods are accepted?",
    answer: "We accept various payment methods including bank transfers, credit/debit cards, and mobile money. You can manage your payment methods and view transaction history in the 'Wallet' section of your dashboard."
  },
  {
    question: "How do I update my personal information?",
    answer: "You can update your personal information by going to the 'Profile' section. Here you can edit your contact details, email address, and bank account information. Remember to save your changes after updating."
  }
];

export default function Support() {
  const router = useRouter();
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const contactInfo = {
    phone: '020 133 06325',
    whatsapp: '+234 813 855 9101',
    email: 'enquiries@banyanclaims.com'
  };

  const showSuccessMessage = (message: string) => {
    setSnackbarMessage(message);
    setShowSnackbar(true);
    setTimeout(() => setShowSnackbar(false), 3000);
  };

  const handlePhoneCall = () => {
    window.location.href = `tel:${contactInfo.phone.replace(/\s+/g, '')}`;
  };

  const handleWhatsApp = () => {
    const message = 'Hello, I need support with my Banyan account.';
    const whatsappUrl = `https://wa.me/${contactInfo.whatsapp.replace(/\s+/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleEmail = () => {
    const subject = 'Support Request';
    const body = 'Hello, I need support with my Banyan account.';
    const mailtoUrl = `mailto:${contactInfo.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Contact Support Section */}
        <div className="bg-white rounded-xl shadow p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Contact Support</h1>

          <div className="space-y-6">
            {/* Phone Call */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#004D40] hover:bg-gray-50 cursor-pointer" onClick={handlePhoneCall}>
              <div className="flex items-center gap-3">
                <div className="bg-[#004D40] p-2 rounded-full">
                  <PhoneIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Call Us</h3>
                  <p className="text-sm text-gray-500">{contactInfo.phone}</p>
                </div>
              </div>
              <div className="text-[#004D40]">
                <PhoneIcon className="w-5 h-5" />
              </div>
            </div>

            {/* WhatsApp */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#004D40] hover:bg-gray-50 cursor-pointer" onClick={handleWhatsApp}>
              <div className="flex items-center gap-3">
                <div className="bg-[#004D40] p-2 rounded-full">
                  <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">WhatsApp</h3>
                  <p className="text-sm text-gray-500">{contactInfo.whatsapp}</p>
                </div>
              </div>
              <div className="text-[#004D40]">
                <ChatBubbleLeftRightIcon className="w-5 h-5" />
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#004D40] hover:bg-gray-50 cursor-pointer" onClick={handleEmail}>
              <div className="flex items-center gap-3">
                <div className="bg-[#004D40] p-2 rounded-full">
                  <EnvelopeIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Email Us</h3>
                  <p className="text-sm text-gray-500">{contactInfo.email}</p>
                </div>
              </div>
              <div className="text-[#004D40]">
                <EnvelopeIcon className="w-5 h-5" />
              </div>
            </div>

            {/* Address */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#004D40] hover:bg-gray-50 cursor-pointer" onClick={() => window.open('https://www.google.com/maps/search/?api=1&query=EridanSpace,+The+Philippi+Centre,+Oluwalogbon+House,+Plot+A+Obafemi+Awolowo+Way,+Alausa,+Ikeja,+Lagos', '_blank')}>
              <div className="flex items-center gap-3">
                <div className="bg-[#004D40] p-2 rounded-full">
                  {/* Location icon solid */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Address</h3>
                  <p className="text-sm text-gray-500">EridanSpace, The Philippi Centre, Oluwalogbon House, Plot A Obafemi Awolowo Way, Alausa, Ikeja, Lagos</p>
                </div>
              </div>
              <div className="text-[#004D40]">
                {/* Location icon outline */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Support Hours</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Monday - Friday: 9:00 AM - 5:00 PM</p>
              <p className="text-sm text-gray-600">Saturday: 10:00 AM - 2:00 PM</p>
              <p className="text-sm text-gray-600">Sunday: Closed</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 rounded-lg"
                >
                  <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                  {expandedFaq === index ? (
                    <ChevronUpIcon className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="p-4 pt-0 text-gray-600">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {showSnackbar && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
            <span>{snackbarMessage}</span>
          </div>
        </div>
      )}
    </main>
  );
} 