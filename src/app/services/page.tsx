import type { Metadata } from 'next';
import Link from 'next/link';
import { servicePillars } from '../content/services';
import PublicPage from '../components/PublicPage';

export const metadata: Metadata = {
  title: 'Claims Support Services | Banyan Claims Nigeria',
  description: 'Explore Banyan’s claims advisory, documentation, workflow support, training and research services in Nigeria.',
  alternates: { canonical: '/services' },
};

export default function ServicesPage() {
  return (
    <PublicPage>
      <section className="bg-[#1B4332] pt-36 pb-20 text-white sm:pt-40">
        <div className="container">
          <p className="eyebrow text-[#F2A65A]">Our services</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">Claims Support for Individuals and Organisations</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-100 sm:text-xl">
            Four practical ways to get clearer guidance, better-organised information, stronger workflow visibility and claims capability.
          </p>
          <p className="mt-8 max-w-3xl border-l-2 border-[#F2A65A] pl-4 text-sm leading-7 text-gray-200">
            Services are limited to Banyan’s approved consultancy scope. Separate regulated services are not provided unless duly authorised.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid gap-6 md:grid-cols-2">
            {servicePillars.map((service) => {
              const Icon = service.icon;
              return (
                <Link key={service.slug} href={service.href} className="group rounded-2xl border border-gray-100 p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#E67635]">
                  <div className="flex items-start justify-between gap-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E7F1ED] text-[#1B4332]">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <span className="text-2xl text-[#E67635] transition group-hover:translate-x-1" aria-hidden="true">→</span>
                  </div>
                  <h2 className="mt-6 text-2xl font-bold text-[#1B4332]">{service.title}</h2>
                  <p className="mt-3 leading-7 text-gray-600">{service.shortDescription}</p>
                </Link>
              );
            })}
          </div>
          <div className="mt-12 rounded-2xl bg-[#F8FAF9] p-8 text-center">
            <h2 className="text-2xl font-bold text-[#1B4332]">Need help choosing the right service?</h2>
            <Link href="/request-support" className="btn-secondary mt-6 inline-flex">Request Support</Link>
          </div>
        </div>
      </section>
    </PublicPage>
  );
}
