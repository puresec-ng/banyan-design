import type { Metadata } from 'next';
import Link from 'next/link';
import PublicPage from '../components/PublicPage';

export const metadata: Metadata = {
  title: 'Terms | Banyan Claims',
  description: 'Terms governing Banyan Claims Consultant Limited’s advisory, documentation, workflow, training and research services.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <PublicPage>
      <section className="bg-[#1B4332] pt-36 pb-20 text-white sm:pt-40">
        <div className="container">
          <p className="eyebrow text-[#F2A65A]">Legal information</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">Terms</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-100">The terms that apply to Banyan’s website and agreed consultancy services.</p>
        </div>
      </section>

      <section className="section">
        <div className="container max-w-3xl space-y-8 text-gray-700">
          <p className="rounded-xl border border-[#E67635]/40 bg-[#FFF8F2] p-5 text-sm leading-6 text-gray-700">
            This draft is staged for Nigerian legal review. It must not be treated as the final approved Terms until the required review is complete.
          </p>

          <div>
            <h2 className="heading-md mb-4">1. About these Terms</h2>
            <p className="leading-7">These Terms apply to use of the Banyan website and to services agreed with Banyan Claims Consultant Limited. The specific services, deliverables, fees and responsibilities for an engagement will be confirmed in the applicable Service Agreement or written scope.</p>
          </div>

          <div>
            <h2 className="heading-md mb-4">2. Nature of Services</h2>
            <p className="leading-7">Banyan Claims Consultant Limited is a claims advisory and support consultancy. Our services may include claims advisory and consultancy, claim readiness and documentation support, workflow and progress tracking, client-authorised communication support, and research, training and capacity-building services. We do not underwrite or sell insurance, act as an insurance broker or intermediary, perform statutory loss-adjusting functions, provide legal representation, decide claims or guarantee claim outcomes.</p>
          </div>

          <div>
            <h2 className="heading-md mb-4">3. Client information</h2>
            <p className="leading-7">You should provide information that is accurate to the best of your knowledge and share only records you are authorised to provide. Banyan may request additional information where it is needed for an agreed service.</p>
          </div>

          <div>
            <h2 className="heading-md mb-4">4. Scope of Services</h2>
            <p className="leading-7">Claims advisory and consultancy relating to the preparation, review, organisation and presentation support of insurance-related claim information. Claim readiness and documentation support, including guidance on relevant records and supporting materials. Workflow and progress-tracking support, including follow-up, status updates and communication support where duly authorised by the client. Research, training, education and capacity-building on claims processes, documentation, communication, workflow improvement, consumer awareness and industry practice.</p>
          </div>

          <div>
            <h2 className="heading-md mb-4">5. Client communications</h2>
            <p className="leading-7">By providing contact details, you may receive service-related communications concerning your enquiry, support request, documentation review, project or service updates. Marketing communications, where used, will be handled separately in accordance with applicable privacy requirements.</p>
          </div>

          <div>
            <h2 className="heading-md mb-4">6. Fees and responsibility</h2>
            <p className="leading-7">Fees, deliverables and payment arrangements will be confirmed before an engagement begins. Banyan is not responsible for the independent decisions, actions, delays or omissions of insurers, brokers, assessors or other third parties in relation to an insurance claim associated with a client engagement. Banyan’s responsibility is limited to the services expressly agreed with the client, subject to the applicable Service Agreement and law.</p>
          </div>

          <div>
            <h2 className="heading-md mb-4">7. Disputes with Banyan</h2>
            <p className="leading-7">If a dispute arises between Banyan and a client concerning these Terms or Banyan’s services, the parties will first seek to resolve it through good-faith discussion. Any further dispute-resolution process will be governed by the applicable Service Agreement and Nigerian law. This clause concerns disputes with Banyan and does not mean Banyan negotiates or represents clients in insurance-claim disputes.</p>
          </div>

          <div>
            <h2 className="heading-md mb-4">8. Privacy</h2>
            <p className="leading-7">Our handling of personal data is described in the <Link href="/privacy" className="font-semibold text-[#1B4332] underline">Privacy Notice</Link>. Essential cookies and any optional analytics cookies are described in the <Link href="/cookies" className="font-semibold text-[#1B4332] underline">Cookie Notice</Link>.</p>
          </div>

          <div>
            <h2 className="heading-md mb-4">9. Contact</h2>
            <p className="leading-7">Questions about these Terms may be sent to <a className="font-semibold text-[#1B4332] underline" href="mailto:enquiries@banyanclaims.com">enquiries@banyanclaims.com</a>.</p>
          </div>

          <p className="border-t border-gray-200 pt-6 text-sm text-gray-500">Effective date: To be set after professional approval.</p>
        </div>
      </section>
    </PublicPage>
  );
}
