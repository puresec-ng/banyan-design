import type { Metadata } from 'next';
import PublicPage from '../components/PublicPage';

export const metadata: Metadata = {
  title: 'Privacy Notice | Banyan Claims',
  description: 'How Banyan Claims Consultant Limited uses and protects personal data across its website, portal and services.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <PublicPage>
      <section className="bg-[#1B4332] pt-36 pb-20 text-white sm:pt-40">
        <div className="container">
          <p className="eyebrow text-[#F2A65A]">Privacy information</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">Privacy Notice</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-100">How Banyan handles personal data across its website, support portal and agreed services.</p>
        </div>
      </section>

      <section className="section">
        <div className="container max-w-3xl space-y-8 text-gray-700">
          <p className="rounded-xl border border-[#E67635]/40 bg-[#FFF8F2] p-5 text-sm leading-6 text-gray-700">
            This draft is staged for privacy adviser/DPCO or Nigerian legal review. It must not be treated as the final approved Privacy Notice until the required review is complete.
          </p>

          <div><h2 className="heading-md mb-4">1. Who we are</h2><p className="leading-7">Banyan Claims Consultant Limited is a Nigerian claims advisory and support consultancy. We determine how personal data is used for our services and digital platforms unless another arrangement is stated.</p></div>
          <div><h2 className="heading-md mb-4">2. What this notice covers</h2><p className="leading-7">This notice applies when you use our website, client portal, contact us, request support, attend a programme or engage Banyan for advisory, documentation, workflow, research or training services.</p></div>
          <div><h2 className="heading-md mb-4">3. Information we may collect</h2><p className="leading-7">Depending on the service, we may collect contact details, organisation details, claim-related information, correspondence, documents you choose to provide, portal and security records, and technical website information. Identity, financial, medical or other sensitive information should be collected only where necessary for the agreed service and permitted by law.</p></div>
          <div><h2 className="heading-md mb-4">4. Why we use information</h2><p className="leading-7">We use information to respond to enquiries, take pre-contract steps, deliver agreed services, review and organise documents, provide workflow support, make client-authorised communications, manage training or research projects, keep records, protect our systems, handle complaints and meet legal obligations.</p></div>
          <div><h2 className="heading-md mb-4">5. Lawful basis</h2><p className="leading-7">Processing may rely on contract or steps requested before a contract, legal obligation, legitimate interests, consent where appropriate, and any additional basis required for sensitive information. The final lawful-basis wording must match the approved data-processing register.</p></div>
          <div><h2 className="heading-md mb-4">6. Sharing</h2><p className="leading-7">We may share information with service providers, professional advisers, insurers, brokers or other relevant parties where necessary for an agreed service, authorised by you, or required by law. Appropriate contractual, security and legal safeguards should be used.</p></div>
          <div><h2 className="heading-md mb-4">7. Retention</h2><p className="leading-7">We keep personal data only for as long as needed for the relevant purpose, legal obligations, complaints, security and record-keeping. Detailed retention periods should be maintained in Banyan’s internal retention schedule.</p></div>
          <div><h2 className="heading-md mb-4">8. Security and incidents</h2><p className="leading-7">We use proportionate technical and organisational safeguards. Suspected personal-data incidents will be assessed, contained and reported where required by applicable law and regulator guidance.</p></div>
          <div><h2 className="heading-md mb-4">9. International transfers</h2><p className="leading-7">Where personal data is transferred outside Nigeria, Banyan will use the safeguards required by applicable Nigerian data-protection law.</p></div>
          <div><h2 className="heading-md mb-4">10. Your rights</h2><p className="leading-7">Subject to applicable law, you may ask to access, correct, delete, restrict or object to certain processing, request portability, withdraw consent where consent is relied on, or raise a concern with Banyan or the Nigeria Data Protection Commission.</p></div>
          <div><h2 className="heading-md mb-4">11. Cookies</h2><p className="leading-7">Essential cookies may be used to operate and secure the site. Analytics or marketing cookies should be used only according to the approved consent configuration. See the <a href="/cookies" className="font-semibold text-[#1B4332] underline">Cookie Notice</a> for details and choices.</p></div>
          <div><h2 className="heading-md mb-4">12. Contact</h2><p className="leading-7">Privacy enquiries: <a className="font-semibold text-[#1B4332] underline" href="mailto:enquiries@banyanclaims.com">enquiries@banyanclaims.com</a>. The final page should identify the approved privacy contact or DPO details if formally appointed.</p></div>

          <p className="border-t border-gray-200 pt-6 text-sm text-gray-500">Effective date: To be set after professional approval.</p>
        </div>
      </section>
    </PublicPage>
  );
}
