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

export default function TermsPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      <div className="max-w-2xl mx-auto py-16 px-4 pt-32">
        <h1 className="text-3xl font-bold mb-6">Banyan Claims Consultant Ltd: Terms and Conditions</h1>
        <div className="space-y-4 text-gray-700">
          <h2 className="text-xl font-semibold mt-6">1. Introduction</h2>
          <p>These Terms and Conditions (&quot;Terms&quot;) govern your access to, and use of the website and services provided by Banyan Claims Consultant Limited (&quot;Banyan Claims&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). By using our website or engaging our advisory services, you agree to comply with these Terms. If you do not agree to any part of these Terms, you must not access or use our services.</p>

          <h2 className="text-xl font-semibold mt-6">2. Nature of Our Services</h2>
          <p>Banyan Claims is a claims advisory and consultancy firm. We do not underwrite, issue, or administer insurance policies. Our role is strictly to support clients in managing, preparing, and pursuing insurance claims, and providing independent advisory services related to claims processes and dispute resolution.</p>

          <h2 className="text-xl font-semibold mt-6">3. Client Eligibility</h2>
          <ul className="list-disc ml-6">
            <li>Be at least 18 years old or of legal contracting age in your jurisdiction.</li>
            <li>Provide accurate, complete, and current information during any engagement.</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6">4A. Advisory Scope</h2>
          <ul className="list-disc ml-6">
            <li>Claims documentation and evidence review</li>
            <li>Advisory on claims rights and obligations</li>
            <li>Liaising with insurers, brokers, or assessors on behalf of clients</li>
            <li>Support during mediation, arbitration, or litigation where applicable</li>
          </ul>
          <p className="italic text-gray-600 mt-2">Note: Banyan Claims cannot guarantee claim approval or payout, as final decisions rest solely with the insurance provider.</p>

          <h2 className="text-xl font-semibold mt-6">4B. Legal Disclaimer</h2>
          <p>Banyan Claims Consultant Limited is not a law firm and does not offer legal representation or legal advice. Any support we provide during mediation, arbitration, or litigation processes is strictly in an advisory capacity relating to insurance claims. We work independently and may collaborate with licensed legal practitioners where necessary, but we do not act as legal counsel. Clients requiring formal legal advice or representation are encouraged to engage a qualified legal professional.</p>

          <h2 className="text-xl font-semibold mt-6">5. Fees and Payment</h2>
          <p>All fees for our services will be clearly communicated and agreed upon prior to engagement. Payment terms and schedules will be outlined in your individual Service Agreement.</p>

          <h2 className="text-xl font-semibold mt-6">6. Confidentiality & Data Protection</h2>
          <p>We adhere to the Nigeria Data Protection Act, 2023. Personal data collected during engagements is treated with the highest confidentiality and is only used for the purpose of delivering our services. Our full <a href="/privacy" className="underline text-blue-700">Privacy Policy</a> outlines your rights and our responsibilities.</p>
          <p>By engaging our services or submitting your contact information, you consent to receive communication from Banyan Claims via email, SMS, or phone regarding your claim, advisory matters, or service updates. You may opt out of non-essential communications at any time.</p>

          <h2 className="text-xl font-semibold mt-6">7. Limitation of Liability</h2>
          <p>Banyan Claims shall not be held liable for any insurer&apos;s decision, action, or inaction regarding a submitted claim. Our responsibility is limited to the provision of accurate and professional advisory services.</p>
          <ul className="list-disc ml-6">
            <li>Claim denials by third parties</li>
            <li>Delays in processing by insurers</li>
            <li>Financial losses arising from client non-disclosure or misrepresentation</li>
          </ul>
          <p>Banyan Claims does not underwrite or issue insurance policies and shall not be liable for insurer decisions or non-payment of claims.</p>

          <h2 className="text-xl font-semibold mt-6">8. Intellectual Property</h2>
          <p>All content on our website, including our logo, written materials, and methodology, is the property of Banyan Claims. You may not copy, reuse, or distribute any of our intellectual property without prior written consent.</p>
          <p>You will notify us if you become aware of any infringement or misappropriation of any of our Intellectual Property rights in the Website, or our brand features and will fully cooperate with us, at our cost, in any action taken by us to enforce our Intellectual Property rights.</p>

          <h2 className="text-xl font-semibold mt-6">9. Acceptable Use</h2>
          <p>You agree not to use our services for any unlawful or fraudulent activity, including submitting false or misleading information to insurers.</p>

          <h2 className="text-xl font-semibold mt-6">10. Website Usage</h2>
          <p>Our website may contain links to third-party websites. We are not responsible for their content, policies, or security practices. Use them at your discretion.</p>
          <p>By using our website, you consent to our use of cookies as outlined in our Privacy Policy. You may manage cookie preferences via your browser settings.</p>

          <h2 className="text-xl font-semibold mt-6">11. Modifications to Terms</h2>
          <p>We may revise these Terms periodically. Updates will be published on our website, and your continued use of our services constitutes acceptance of the revised Terms.</p>

          <h2 className="text-xl font-semibold mt-6">12. Governing Law</h2>
          <p>These Terms are governed by the laws of the Federal Republic of Nigeria. Any disputes shall be resolved under the jurisdiction of Nigerian courts.</p>

          <h2 className="text-xl font-semibold mt-6">12A. Dispute Resolution</h2>
          <p>In the event of any dispute arising out of or in connection with these Terms or our services, both parties agree to attempt to resolve the matter amicably through good-faith negotiations. Where resolution is not achieved, the parties may consider mediation or arbitration before pursuing litigation.</p>

          <h2 className="text-xl font-semibold mt-6">12B. Force Majeure</h2>
          <p>Banyan Claims shall not be held liable for any failure or delay in the performance of its obligations due to events beyond reasonable control, including but not limited to natural disasters, acts of government, internet outages, or civil unrest.</p>

          <h2 className="text-xl font-semibold mt-6">12C. Severability</h2>
          <p>If any provision of these Terms is found to be invalid or unenforceable, such provision shall be modified to reflect the parties&apos; intention, and all remaining provisions shall remain in full force and effect.</p>

          <h2 className="text-xl font-semibold mt-6">13. Contact Us</h2>
          <p>For questions or complaints regarding these Terms: Banyan Claims Consultant Limited<br/>
          Email: <a href="mailto:enquiries@banyanclaims.com" className="underline text-blue-700">enquiries@banyanclaims.com</a><br/>
          Website: <a href="https://www.banyanclaims.com" className="underline text-blue-700">www.banyanclaims.com</a></p>
          <p className="text-xs text-gray-500 mt-8">Effective Date: June 2025</p>
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