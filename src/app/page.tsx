'use client'
import Link from 'next/link';
import Image from 'next/image';
import {
  BuildingOfficeIcon,
  BuildingStorefrontIcon as TreeIcon,
  TruckIcon,
  DevicePhoneMobileIcon,
  HomeIcon,
  PhoneIcon,
  CheckIcon,
  UserGroupIcon,
  BoltIcon,
  ShieldCheckIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import { contactUs } from './services/public';
import { useState } from 'react';
import emailjs from 'emailjs-com';

// Add social icons import
import {
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaFacebook,
} from 'react-icons/fa';

// Types
type NavigationItem = {
  name: string;
  href: string;
};

const navigation: NavigationItem[] = [
  { name: 'Home', href: '#home' },
  { name: 'Services', href: '#services' },
  { name: 'Process', href: '#process' },
  { name: 'About', href: '#about' },
  { name: 'Contact', href: '#contact' },
];

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  // handle contact us
  const handleContactUs = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      await emailjs.send(
        'service_wmg43vp', // Service ID
        'template_8jnqeup', // Template ID
        {
          from_name: formData.get('name'),      // Full Name
          from_email: formData.get('email'),    // Email Address
          message: `Email: ${formData.get('email')}

${formData.get('message')}` // Message body includes email
        },
        'P0j4XeljA-hZrLyWO' // Public Key
      );
      setSubmitStatus({
        type: 'success',
        message: 'Thank you for your message. We will get back to you soon!'
      });
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.log('EmailJS error:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Failed to send message. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />

      {/* Divider */}
      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      </div>

      {/* Services Section */}
      <section id="services" className="section bg-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="heading-lg mb-6">Our Insurance Claim Services</h2>
            <p className="text-lg text-gray-600">
              We specialize in various types of insurance claims, providing expert guidance
              and support throughout the entire process.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.title}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <service.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="section bg-gray-50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="heading-lg mb-6">How It Works</h2>
            <p className="text-lg text-gray-600">
              Our streamlined process makes claiming insurance simple and hassle-free.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={step.title} className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary text-white text-2xl font-bold flex items-center justify-center mx-auto mb-6">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section bg-white">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-lg mb-6 text-center">About Banyan Claims</h2>
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-lg text-gray-600">
                  Banyan Claims Consultant Limited is Nigeria's most trusted technology-driven claims consultancy. We specialize in providing efficient, transparent, and professional claims management services to individuals and businesses across Nigeria.
                </p>
                <p className="text-lg text-gray-600 mt-4">
                  Our team of experienced professionals combines deep industry knowledge with cutting-edge technology to ensure your claims are handled with the utmost care and efficiency.
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
                <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <UserGroupIcon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Expert Team</h3>
                  <p className="text-gray-600">Experienced professionals dedicated to your success</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <BoltIcon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Fast Processing</h3>
                  <p className="text-gray-600">Quick and efficient claims handling</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <ShieldCheckIcon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Trusted Service</h3>
                  <p className="text-gray-600">Reliable and transparent claims management</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <ChartBarIcon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Data-Driven</h3>
                  <p className="text-gray-600">Advanced analytics for optimal claim outcomes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section bg-gray-50">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="heading-lg mb-6">Get in Touch</h2>
              <p className="text-lg text-gray-600 mb-8">
                Ready to start your claim? Contact us today and let our experts guide you
                through the process.
              </p>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-2">Visit Us</h3>
                  <p className="text-gray-600">EridanSpace, The Philippi Centre, Oluwalogbon House, Plot A Obafemi Awolowo Way, Alausa, Ikeja, Lagos</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Contact</h3>
                  <p className="text-gray-600">Phone: 02013306325</p>
                  <p className="text-gray-600">Email: enquiries@banyanclaims.com</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Hours</h3>
                  <p className="text-gray-600">Monday - Friday: 9am - 5pm</p>
                  <p className="text-gray-600">24/7 Online Support Available</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <form onSubmit={handleContactUs} className="space-y-6">
                {submitStatus.type && (
                  <div className={`p-4 rounded-lg ${submitStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                    {submitStatus.message}
                  </div>
                )}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

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
                    <Link href="#services" className="text-gray-200 hover:text-white transition-colors">
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

// Data
const services = [
  {
    title: 'SME Claims',
    description: 'Comprehensive claims support for small and medium enterprises.',
    icon: BuildingOfficeIcon,
  },
  {
    title: 'Agro Claims',
    description: 'Specialized claims processing for agricultural businesses.',
    icon: TreeIcon,
  },
  {
    title: 'Motor Claims',
    description: 'Swift and efficient motor insurance claims resolution.',
    icon: TruckIcon,
  },
  {
    title: 'Gadget Claims',
    description: 'Expert handling of electronic device insurance claims.',
    icon: DevicePhoneMobileIcon,
  },
  {
    title: 'Householder Claims',
    description: 'Complete support for residential insurance claims.',
    icon: HomeIcon,
  },
  {
    title: '24/7 Support',
    description: 'Round-the-clock assistance for all your claims needs.',
    icon: PhoneIcon,
  },
];

const steps = [
  {
    title: 'Submit Your Claim',
    description: 'Fill out our simple online form with your claim details and documentation.',
  },
  {
    title: 'We Process',
    description: 'Our experts review your claim and handle all communications with insurers.',
  },
  {
    title: 'Get Resolution',
    description: 'Receive your settlement quickly and efficiently through our streamlined process.',
  },
];

const features = [
  'Technology-driven claims processing',
  'Expert claims advocacy team',
  'Transparent communication',
  'Fast-track claim settlements',
  'Dedicated customer support',
  'Nationwide coverage',
];
