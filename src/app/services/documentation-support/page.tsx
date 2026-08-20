import type { Metadata } from 'next';
import ServicePage from '../../components/ServicePage';
import { serviceBySlug } from '../../content/services';

export const metadata: Metadata = {
  title: 'Claim Documentation Support | Banyan Claims Nigeria',
  description: 'Structured claim readiness and documentation support to help organise records, evidence and outstanding information.',
  alternates: { canonical: '/services/documentation-support' },
};

export default function DocumentationSupportPage() {
  return <ServicePage service={serviceBySlug['documentation-support']} />;
}
