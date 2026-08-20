import type { Metadata } from 'next';
import RequestSupportForm from '../components/RequestSupportForm';
import PublicPage from '../components/PublicPage';

export const metadata: Metadata = {
  title: 'Request Support | Banyan Claims',
  description: 'Tell Banyan what support you need and receive next-step guidance for an appropriate service.',
  alternates: { canonical: '/request-support' },
};

export default function RequestSupportPage() {
  return (
    <PublicPage>
      <section className="bg-[#1B4332] pt-36 pb-20 text-white sm:pt-40">
        <div className="container">
          <p className="eyebrow text-[#F2A65A]">Start a conversation</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">Request Support</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-100 sm:text-xl">Tell us what help you need. We will confirm scope before any engagement begins.</p>
          <p className="mt-8 max-w-3xl border-l-2 border-[#F2A65A] pl-4 text-sm leading-7 text-gray-200">Banyan provides advisory and support services only. Formal claim decisions remain with the relevant insurer or authorised party.</p>
        </div>
      </section>
      <section className="section bg-gray-50">
        <div className="container grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="heading-md">Choose the support you need</h2>
            <p className="mt-5 text-lg leading-8 text-gray-600">Use the service selector to show the questions relevant to your request. Claim-related information is kept to a minimum at first contact.</p>
            <ul className="mt-8 space-y-3 text-gray-700">
              <li>• Claims Advisory</li>
              <li>• Documentation Support</li>
              <li>• Workflow &amp; Tracking</li>
              <li>• Training or Research</li>
            </ul>
          </div>
          <RequestSupportForm />
        </div>
      </section>
    </PublicPage>
  );
}
