import type { Metadata } from 'next';
import Link from 'next/link';
import PublicPage from '../components/PublicPage';

export const metadata: Metadata = {
  title: 'About Banyan Claims Consultant Limited',
  description: 'Learn about Banyan’s Nigerian claims advisory, support, training and research consultancy model.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <PublicPage>
      <section className="bg-[#1B4332] pt-36 pb-20 text-white sm:pt-40">
        <div className="container">
          <p className="eyebrow text-[#F2A65A]">About Banyan</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">About Banyan</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-100 sm:text-xl">
            A Nigerian claims advisory and support consultancy built around clarity, structure and practical support.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container max-w-4xl">
          <div className="space-y-6 text-lg leading-8 text-gray-700">
            <p>Banyan Claims Consultant Limited is a Nigerian claims advisory and support consultancy. We help individuals, businesses and organisations prepare and organise claim information, track actions and communications, and improve claims capability through practical training and research.</p>
            <p>Our work is structured, transparent and limited to services we are authorised and competent to provide.</p>
          </div>
          <Link href="/services" className="btn-secondary mt-10 inline-flex">Explore Our Services</Link>
        </div>
      </section>
    </PublicPage>
  );
}
