import Link from 'next/link';
import Image from 'next/image';
import {
  FaLinkedin,
  FaInstagram,
  FaWhatsapp,
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'Training & Research', href: '/training-research' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

const services = [
  { name: 'Claims Advisory', href: '/services/claims-advisory' },
  { name: 'Documentation Support', href: '/services/documentation-support' },
  { name: 'Workflow & Tracking', href: '/services/workflow-tracking' },
  { name: 'Training & Research', href: '/training-research' },
];

const socials = [
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/banyanclaims/', icon: FaLinkedin },
  { name: 'X', href: 'https://x.com/banyanclaims', icon: FaXTwitter },
  { name: 'Instagram', href: 'https://www.instagram.com/banyanclaims', icon: FaInstagram },
  { name: 'WhatsApp', href: 'https://wa.me/2348138559101', icon: FaWhatsapp },
];

export default function Footer() {
  return (
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
              {services.map((title) => (
                <li key={title.name}>
                  <Link href={title.href} className="text-gray-200 hover:text-white transition-colors">
                    {title.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-200 hover:text-white transition-colors"
                >
                  <span className="sr-only">{social.name}</span>
                  <social.icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-[#2d5445] text-center text-gray-200">
          <p className="max-w-4xl mx-auto text-sm leading-relaxed">
            Banyan Claims Consultant Limited provides claims advisory, documentation, workflow, training and research consultancy services only. We do not underwrite or sell insurance, act as brokers, perform statutory loss-adjusting functions or decide claims.
          </p>
          <p className="mt-6">&copy; {new Date().getFullYear()} Banyan Claims Consultant Limited. All rights reserved.</p>
          <div className="mt-2 flex justify-center gap-6 text-sm">
            <Link href="/terms" className="underline hover:text-white">Terms</Link>
            <Link href="/privacy" className="underline hover:text-white">Privacy</Link>
            <Link href="/cookies" className="underline hover:text-white">Cookie Notice</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
