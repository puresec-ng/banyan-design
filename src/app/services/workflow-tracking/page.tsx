import type { Metadata } from 'next';
import ServicePage from '../../components/ServicePage';
import { serviceBySlug } from '../../content/services';

export const metadata: Metadata = {
  title: 'Claims Workflow and Progress Tracking | Banyan Claims',
  description: 'Structured claims workflow support, action tracking, status updates and authorised follow-up support.',
  alternates: { canonical: '/services/workflow-tracking' },
};

export default function WorkflowTrackingPage() {
  return <ServicePage service={serviceBySlug['workflow-tracking']} />;
}
