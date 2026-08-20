import type { Metadata } from 'next';
import ServicePage from '../components/ServicePage';
import { serviceBySlug } from '../content/services';

export const metadata: Metadata = {
  title: 'Claims Training and Research | Banyan Claims Nigeria',
  description: 'Claims training, process review, consumer education and practical research for businesses and organisations in Nigeria.',
  alternates: { canonical: '/training-research' },
};

export default function TrainingResearchPage() {
  return <ServicePage service={serviceBySlug['training-research']} />;
}
