'use client';

import { useRouter } from 'next/navigation';

export default function ExternalUpdatePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-16">
      <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Awaiting External Update</h1>
        <p className="mt-4 leading-7 text-gray-600">
          External updates are shown only through the agreed support workflow. Banyan will record relevant information and take any client-authorised communication action only where valid authority is recorded.
        </p>
        <button type="button" onClick={() => router.push('/portal/dashboard')} className="btn-primary mt-8">
          Return to Support Requests
        </button>
      </div>
    </main>
  );
}
