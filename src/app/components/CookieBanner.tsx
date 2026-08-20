'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const CONSENT_KEY = 'banyan-cookie-consent';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  useEffect(() => {
    setVisible(window.localStorage.getItem(CONSENT_KEY) === null);
  }, []);

  function saveConsent(value: 'analytics' | 'essential') {
    window.localStorage.setItem(CONSENT_KEY, value);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <aside role="dialog" aria-label="Cookie choices" className="fixed inset-x-4 bottom-4 z-[120] mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl sm:inset-x-auto sm:right-6 sm:left-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-xl">
          <h2 className="text-lg font-bold text-[#1B4332]">Cookie choices</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">We use essential cookies to run and secure this site. With your permission, we may also use analytics cookies to understand how the site is used.</p>
          <Link href="/cookies" className="mt-2 inline-block text-sm font-semibold text-[#1B4332] underline">Cookie Notice</Link>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
          <button type="button" onClick={() => saveConsent('analytics')} className="btn-secondary px-4 py-2 text-sm">Accept Analytics</button>
          <button type="button" onClick={() => saveConsent('essential')} className="rounded-lg border border-gray-300 px-4 py-2 font-montserrat text-sm font-semibold text-gray-700 hover:bg-gray-50">Essential Only</button>
          <button type="button" onClick={() => setShowPreferences((current) => !current)} className="rounded-lg px-4 py-2 font-montserrat text-sm font-semibold text-[#1B4332] underline">Manage Choices</button>
        </div>
      </div>
      {showPreferences && (
        <p className="mt-4 border-t border-gray-100 pt-4 text-sm leading-6 text-gray-600">Analytics and marketing tags must follow the approved consent configuration. No optional tags are enabled by this interface until that configuration is confirmed.</p>
      )}
    </aside>
  );
}
