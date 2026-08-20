import type { Metadata } from 'next';
import PublicPage from '../components/PublicPage';

export const metadata: Metadata = {
  title: 'Cookie Notice | Banyan Claims',
  description: 'How Banyan uses essential and optional analytics cookies on this website.',
  alternates: { canonical: '/cookies' },
};

export default function CookiesPage() {
  return (
    <PublicPage>
      <section className="bg-[#1B4332] pt-36 pb-20 text-white sm:pt-40">
        <div className="container">
          <p className="eyebrow text-[#F2A65A]">Privacy controls</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">Cookie Notice</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-100">A short explanation of the cookies used to operate and understand this website.</p>
        </div>
      </section>
      <section className="section">
        <div className="container max-w-3xl space-y-8 text-lg leading-8 text-gray-700">
          <div>
            <h2 className="heading-md mb-4">Essential cookies</h2>
            <p>Essential cookies may be used to operate and secure this site. They are needed for core functionality and cannot be switched off through this notice.</p>
          </div>
          <div>
            <h2 className="heading-md mb-4">Analytics cookies</h2>
            <p>With your permission, analytics cookies may help us understand how the site is used. Analytics or marketing tags should run only according to the approved consent configuration.</p>
          </div>
          <div>
            <h2 className="heading-md mb-4">Your choices</h2>
            <p>Users should be able to accept analytics, use essential cookies only, or manage choices. The final banner behaviour must match Banyan’s approved analytics and privacy configuration.</p>
          </div>
        </div>
      </section>
    </PublicPage>
  );
}
