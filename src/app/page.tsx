import type { Metadata } from 'next';
import Link from 'next/link';
import { servicePillars } from './content/services';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import CookieBanner from './components/CookieBanner';

export const metadata: Metadata = {
  title: 'Banyan Claims | Claims Advisory and Support in Nigeria',
  description:
    'Claims advisory, documentation support, workflow tracking, training and research for individuals, businesses and organisations in Nigeria.',
  alternates: { canonical: '/' },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />

      <section id="services" className="section scroll-mt-24">
        <div className="container">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="eyebrow">Four ways to get clearer support</p>
            <h2 className="heading-lg mt-3">Practical support, structured around your need</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {servicePillars.map((service) => {
              const Icon = service.icon;
              return (
                <Link
                  key={service.slug}
                  href={service.href}
                  className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#E67635]"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#E7F1ED] text-[#1B4332]">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-[#1B4332]">{service.title}</h3>
                  <p className="leading-7 text-gray-600">{service.shortDescription}</p>
                  <span className="mt-5 inline-flex font-montserrat text-sm font-semibold text-[#E67635] group-hover:underline">
                    Explore service <span aria-hidden="true" className="ml-1">→</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#F8FAF9] py-12">
        <div className="container">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="eyebrow">Common support areas</p>
              <p className="mt-2 text-gray-700">Examples only. Support is subject to scope and competence.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {['Motor', 'SME', 'Gadget', 'Householder', 'Other business needs'].map((item) => (
                <span key={item} className="rounded-full border border-[#BBD2C6] bg-white px-4 py-2 text-sm font-medium text-[#1B4332]">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="process" className="section scroll-mt-24">
        <div className="container">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="eyebrow">A clear starting point</p>
            <h2 className="heading-lg mt-3">How support works</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              ['1', 'Tell Us What You Need', 'Choose the support you need and share the essential information.'],
              ['2', 'We Confirm Scope', 'We confirm what we can do, the deliverables, fees and any authority required.'],
              ['3', 'We Deliver Support', 'You receive the agreed guidance, review, tracker, workshop or project output.'],
            ].map(([number, title, description]) => (
              <div key={number} className="rounded-2xl border border-gray-100 bg-white p-7 shadow-sm">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1B4332] font-montserrat font-bold text-white">{number}</span>
                <h3 className="mt-6 text-xl font-bold text-[#1B4332]">{title}</h3>
                <p className="mt-3 leading-7 text-gray-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="bg-[#1B4332] py-16 text-white scroll-mt-24">
        <div className="container flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="eyebrow text-[#F2A65A]">About Banyan</p>
            <p className="mt-4 text-xl leading-9 text-gray-100">
              Banyan Claims Consultant Limited is a Nigerian claims advisory and support consultancy built around clarity, structure and practical support.
            </p>
          </div>
          <Link href="/services" className="btn-secondary inline-flex shrink-0">Explore Our Services</Link>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="rounded-3xl bg-[#F3F7F5] px-6 py-12 text-center sm:px-12">
            <p className="eyebrow">Need a starting point?</p>
            <h2 className="heading-md mt-3">Not sure what support you need?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-gray-600">
              Tell us what you are trying to achieve. We will confirm the right next step.
            </p>
            <Link href="/request-support" className="btn-secondary mt-8 inline-flex">Talk to Banyan</Link>
          </div>
        </div>
      </section>

      <Footer />
      <CookieBanner />
    </main>
  );
}
