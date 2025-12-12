'use client'
import React from 'react';
import Navbar from '../components/Navbar';
import Link from 'next/link';
import Image from 'next/image';
import {
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaFacebook,
} from 'react-icons/fa';

// Navigation data
const navigation = [
  { name: 'Home', href: '/#home' },
  { name: 'Services', href: '/#services' },
  { name: 'Process', href: '/#process' },
  { name: 'About', href: '/#about' },
  { name: 'Contact', href: '/#contact' },
];

// Services data
const services = [
  { title: 'SME Claims' },
  { title: 'Agro Claims' },
  { title: 'Motor Claims' },
  { title: 'Gadget Claims' },
  { title: 'Householder Claims' },
  { title: '24/7 Support' },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      <div className="max-w-2xl mx-auto py-16 px-4 pt-32">
        <h1 className="text-3xl font-bold mb-6">Banyan Claims Consultant Ltd: Privacy Policy</h1>
        <div className="space-y-4 text-gray-700">
          <h2 className="text-xl font-semibold mt-6">1. Introduction</h2>
          <p>Banyan Claims Consultant Limited (&quot;Banyan Claims&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting the privacy and security of the personal information of our clients, employees, partners, and website visitors (&quot;you&quot; or &quot;your&quot;). This Privacy Policy outlines how we collect, use, disclose, and safeguard your personal data in compliance with the Nigeria Data Protection Act, 2023 and other applicable regulations.</p>
          <p>We are a claims consultancy and advisory firm, not an insurance provider, legal practice, or data broker.</p>

          <h2 className="text-xl font-semibold mt-6">2. Scope and Consent</h2>
          <p>By accessing our website, using our mobile application, or engaging our services, you consent to the collection, use, storage, and sharing of your personal data as described in this Policy. This includes data shared during consultations, claims support, or through any of our digital platforms.</p>

          <h2 className="text-xl font-semibold mt-6">3. Definitions</h2>
          <ul className="list-disc ml-6">
            <li><strong>Data Subject:</strong> An individual whose personal data is collected.</li>
            <li><strong>Data Controller:</strong> Banyan Claims Consultant Ltd, which determines how and why personal data is processed.</li>
            <li><strong>Data Administrator:</strong> Persons within Banyan Claims who manage data operations.</li>
            <li><strong>Data Protection Officer:</strong> A designated officer responsible for overseeing compliance.</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6">4. Information We Collect</h2>
          <h3 className="font-semibold mt-4">A. Information You Provide</h3>
          <ul className="list-disc ml-6">
            <li>Personal Information (e.g., name, email, phone number, date of birth)</li>
            <li>Identification Data (e.g., NIN, passport number, voter&apos;s card, driver&apos;s license)</li>
            <li>Financial Information (e.g., BVN, bank details where required)</li>
            <li>Sensitive Data (e.g., marital status, medical records where necessary for claims support)</li>
          </ul>
          <h3 className="font-semibold mt-4">B. Automatically Collected Data</h3>
          <ul className="list-disc ml-6">
            <li>IP address, browser type, device ID, operating system</li>
            <li>Usage patterns (e.g., session duration, clickstream data)</li>
          </ul>
          <h3 className="font-semibold mt-4">C. Cookies and Tracking</h3>
          <p>We use cookies for analytics, security, and functionality. You can manage cookies via your browser settings. If advanced tracking (e.g., Meta Pixel) is used, a separate cookie notice will be made available.</p>
          <h3 className="font-semibold mt-4">D. Third-Party Information</h3>
          <p>We may receive information from professional partners (e.g., legal advisors, insurers, assessors) for the purposes of claims investigation or dispute resolution.</p>

          <h2 className="text-xl font-semibold mt-6">5. How We Use Your Information</h2>
          <ul className="list-disc ml-6">
            <li>To deliver, personalize, and improve our services</li>
            <li>To communicate with you regarding your service or inquiries</li>
            <li>To support claims advisory, analysis, and negotiations</li>
            <li>To comply with legal and regulatory requirements (e.g., NDPC, NAICOM)</li>
            <li>For risk detection, fraud prevention, and dispute resolution</li>
          </ul>
          <p className="text-gray-600 italic">Disclaimer: We do not provide legal representation. If formal legal action is required, we may refer you to licensed legal professionals.</p>

          <h2 className="text-xl font-semibold mt-6">6. Sharing and Disclosure</h2>
          <p>We only share your information when:</p>
          <ul className="list-disc ml-6">
            <li>It is necessary to perform our services</li>
            <li>Mandated by law or regulatory authorities</li>
            <li>You provide explicit, informed consent</li>
            <li>With service providers under contractual confidentiality obligations</li>
          </ul>
          <p>We are not liable for the misuse of data by third parties beyond our control.</p>

          <h2 className="text-xl font-semibold mt-6">7. Children&apos;s Data</h2>
          <p>We do not knowingly collect data from individuals under the age of 18. If such data is inadvertently collected, it will be deleted upon discovery.</p>

          <h2 className="text-xl font-semibold mt-6">8. Data Security</h2>
          <p>We adopt industry-standard measures including:</p>
          <ul className="list-disc ml-6">
            <li>Data encryption</li>
            <li>Access control</li>
            <li>Secure storage practices</li>
          </ul>
          <p>We will notify the NDPC within 72 hours and affected users where there is a data breach that may impact your rights.</p>

          <h2 className="text-xl font-semibold mt-6">9. Data Retention</h2>
          <p>We retain personal data only for as long as required to meet legal, regulatory, and operational obligations. Residual backup data will be protected with equivalent safeguards.</p>

          <h2 className="text-xl font-semibold mt-6">10. International Transfers</h2>
          <p>Data may be transferred outside Nigeria in accordance with the Nigeria Data Protection Act, 2023, subject to appropriate legal and contractual safeguards.</p>

          <h2 className="text-xl font-semibold mt-6">11. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc ml-6">
            <li>Access your data</li>
            <li>Request corrections or deletion</li>
            <li>Object to or restrict processing</li>
            <li>Request data portability</li>
            <li>Withdraw consent at any time</li>
            <li>Lodge complaints with the NDPC or our DPO</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6">12. Policy Updates</h2>
          <p>This Policy may be updated periodically. All revisions will be posted on our website.</p>

          <h2 className="text-xl font-semibold mt-6">13. Contact Us</h2>
          <p>Data Protection Officer<br/>
          Banyan Claims Consultant Limited<br/>
          Email: <a href="mailto:enquiries@banyanclaims.com" className="underline text-blue-700">enquiries@banyanclaims.com</a><br/>
          Website: <a href="https://www.banyanclaims.com" className="underline text-blue-700">www.banyanclaims.com</a></p>
          <p className="mt-8">Thank you for trusting Banyan Claims Consultant Limited.</p>
          <p className="text-xs text-gray-500 mt-4">Effective Date: June 2025<br/>Last Updated: June 2025</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#1B4332] text-white py-12">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="relative w-48 h-24 mb-4">
                <Image
                  src="/brand/logo-tree.png"
                  alt="Banyan Claims Logo"
                  fill
                  style={{ objectFit: 'contain' }}
                  className="brightness-0 invert"
                  priority
                />
              </div>
              <p className="text-gray-200">
                Simplifying Claims, Strengthening Trust
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-gray-200 hover:text-white transition-colors">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Services</h4>
              <ul className="space-y-2">
                {services.map((service) => (
                  <li key={service.title}>
                    <Link href="/#services" className="text-gray-200 hover:text-white transition-colors">
                      {service.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Connect With Us</h4>
              <div className="flex space-x-4">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-200 hover:text-white transition-colors"
                >
                  <span className="sr-only">LinkedIn</span>
                  <FaLinkedin className="w-6 h-6" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-200 hover:text-white transition-colors"
                >
                  <span className="sr-only">Twitter</span>
                  <FaTwitter className="w-6 h-6" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-200 hover:text-white transition-colors"
                >
                  <span className="sr-only">Instagram</span>
                  <FaInstagram className="w-6 h-6" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-200 hover:text-white transition-colors"
                >
                  <span className="sr-only">Facebook</span>
                  <FaFacebook className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-[#2d5445] text-center text-gray-200">
            <p>&copy; {new Date().getFullYear()} Banyan Claims Consultant Limited. All rights reserved.</p>
            <div className="mt-2 flex justify-center gap-6 text-sm">
              <Link href="/terms" className="underline hover:text-white">Terms & Conditions</Link>
              <Link href="/privacy" className="underline hover:text-white">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
} 