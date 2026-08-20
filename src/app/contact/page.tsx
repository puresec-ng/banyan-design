import type { Metadata } from 'next';
import ContactForm from '../components/ContactForm';
import PublicPage from '../components/PublicPage';

export const metadata: Metadata = {
  title: 'Contact Banyan Claims Consultant Limited',
  description: 'Contact Banyan about claims advisory, documentation support, workflow support, training or research.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <PublicPage>
      <section className="bg-[#1B4332] pt-36 pb-20 text-white sm:pt-40">
        <div className="container">
          <p className="eyebrow text-[#F2A65A]">Contact Banyan</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">Tell Us What You Need</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-100 sm:text-xl">
            Choose claims support, advisory, training or a general enquiry. We will confirm the right next step.
          </p>
        </div>
      </section>
      <section className="section bg-gray-50">
        <div className="container grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="heading-md">Start with a clear brief</h2>
            <p className="mt-5 text-lg leading-8 text-gray-600">Share only the information needed for your first enquiry. We can request further detail if it is needed for an agreed service.</p>
            <p className="mt-8 border-l-2 border-[#E67635] pl-4 text-sm leading-7 text-gray-600">Advisory and support only. Formal decisions remain with the relevant insurer or authorised party.</p>
          </div>
          <ContactForm />
        </div>
      </section>
    </PublicPage>
  );
}
