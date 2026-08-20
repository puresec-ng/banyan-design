import Link from 'next/link';
import type { ServicePillar } from '../content/services';
import PublicPage from './PublicPage';

export default function ServicePage({ service }: { service: ServicePillar }) {
  const Icon = service.icon;

  return (
    <PublicPage>
      <section className="bg-[#1B4332] pt-36 pb-20 text-white sm:pt-40">
        <div className="container">
          <div className="max-w-4xl">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
              <Icon className="h-7 w-7 text-[#F2A65A]" aria-hidden="true" />
            </div>
            <p className="mb-4 font-montserrat text-sm font-semibold uppercase tracking-[0.18em] text-[#F2A65A]">
              Banyan service pillar
            </p>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">{service.h1}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-100 sm:text-xl">{service.hero}</p>
            <p className="mt-8 max-w-3xl border-l-2 border-[#F2A65A] pl-4 text-sm leading-7 text-gray-200">
              {service.boundary}
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h2 className="heading-md mb-6">How we can help</h2>
            <ul className="space-y-4">
              {service.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-3 text-lg leading-8 text-gray-700">
                  <span className="mt-3 h-2 w-2 shrink-0 rounded-full bg-[#E67635]" aria-hidden="true" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
          <aside className="rounded-2xl bg-[#F3F7F5] p-8">
            {service.whoItIsFor && (
              <>
                <h2 className="mb-3 text-xl font-bold text-[#1B4332]">Who it is for</h2>
                <p className="mb-8 leading-7 text-gray-700">{service.whoItIsFor}</p>
              </>
            )}
            <h2 className="mb-3 text-xl font-bold text-[#1B4332]">What you receive</h2>
            <p className="leading-7 text-gray-700">{service.whatYouReceive}</p>
          </aside>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="container max-w-4xl">
          <h2 className="heading-md mb-8">Common questions</h2>
          <div className="space-y-4">
            {service.faqs.map((faq) => (
              <details key={faq.question} className="rounded-xl bg-white p-5 shadow-sm">
                <summary className="cursor-pointer font-semibold text-gray-900">{faq.question}</summary>
                <p className="mt-3 leading-7 text-gray-600">{faq.answer}</p>
              </details>
            ))}
          </div>
          <Link href="/request-support" className="btn-secondary mt-10 inline-flex">
            {service.cta}
          </Link>
        </div>
      </section>
    </PublicPage>
  );
}
