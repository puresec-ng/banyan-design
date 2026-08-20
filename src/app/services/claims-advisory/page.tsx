import type { Metadata } from 'next';
import ServicePage from '../../components/ServicePage';
import { serviceBySlug } from '../../content/services';

export const metadata: Metadata = {
  title: 'Claims Advisory and Consultancy | Banyan Claims',
  description: 'Practical claims advisory and consultancy support for individuals, businesses and organisations in Nigeria.',
  alternates: { canonical: '/services/claims-advisory' },
};

export default function ClaimsAdvisoryPage() {
  return <ServicePage service={serviceBySlug['claims-advisory']} />;
}
