import {
  AcademicCapIcon,
  ArrowPathIcon,
  ClipboardDocumentListIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import type { ComponentType, SVGProps } from 'react';

export type ServiceIcon = ComponentType<SVGProps<SVGSVGElement>>;

export type ServicePillar = {
  slug: string;
  href: string;
  title: string;
  shortDescription: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  hero: string;
  whoItIsFor?: string;
  whatYouReceive: string;
  boundary: string;
  cta: string;
  icon: ServiceIcon;
  bullets: string[];
  faqs: Array<{ question: string; answer: string }>;
};

export const servicePillars: ServicePillar[] = [
  {
    slug: 'claims-advisory',
    href: '/services/claims-advisory',
    title: 'Claims Advisory',
    shortDescription: 'Practical guidance to prepare, review and organise insurance-related claim information.',
    metaTitle: 'Claims Advisory and Consultancy | Banyan Claims',
    metaDescription: 'Practical claims advisory and consultancy support for individuals, businesses and organisations in Nigeria.',
    h1: 'Claims Advisory and Consultancy',
    hero: 'Practical guidance to help you prepare, review and organise insurance-related claim information.',
    whoItIsFor: 'Individuals, SMEs, corporate teams and organisations that need structured claims guidance.',
    whatYouReceive: 'A clear scope, practical guidance and agreed deliverables.',
    boundary: 'We do not provide legal advice, determine insurance coverage or negotiate settlement.',
    cta: 'Request Advisory Support',
    icon: DocumentTextIcon,
    bullets: [
      'Review available claim information and clarify practical next steps.',
      'Help organise claim-related records and correspondence.',
      'Support preparation of information for presentation to the relevant party.',
      'Provide project-based claims process guidance to organisations.',
    ],
    faqs: [
      { question: 'Does Banyan decide whether my claim is covered?', answer: 'No. Coverage and claim decisions remain with the insurer or other authorised decision-maker.' },
      { question: 'Can Banyan help me prepare information for submission?', answer: 'Yes. We can support preparation, review and organisation of claim-related information.' },
      { question: 'Can businesses use Banyan for a wider claims project?', answer: 'Yes, where the project falls within our consultancy scope and agreed competence.' },
    ],
  },
  {
    slug: 'documentation-support',
    href: '/services/documentation-support',
    title: 'Documentation Support',
    shortDescription: 'Identify gaps and build a clearer, better-organised claim file.',
    metaTitle: 'Claim Documentation Support | Banyan Claims Nigeria',
    metaDescription: 'Structured claim readiness and documentation support to help organise records, evidence and outstanding information.',
    h1: 'Claim Readiness and Documentation Support',
    hero: 'Build a clearer claim file before or during insurer review.',
    whatYouReceive: 'An organised support file and a clear list of outstanding items or next actions.',
    boundary: 'Requirements vary by insurer and policy. We do not guarantee claim acceptance or outcome.',
    cta: 'Request Documentation Support',
    icon: ClipboardDocumentListIcon,
    bullets: [
      'Identify documents and records that may be relevant.',
      'Organise available evidence and correspondence.',
      'Highlight information or documentation gaps.',
      'Prepare an outstanding-items summary and clearer file structure.',
    ],
    faqs: [
      { question: 'Do I need every document before I contact Banyan?', answer: 'No. Start with what you have. We can help identify likely gaps.' },
      { question: 'Can Banyan support preparation for submission?', answer: 'Banyan provides submission support. The formal receiving and decision-making role remains with the relevant insurer or authorised party.' },
      { question: 'What can I share?', answer: 'Relevant policy information, correspondence, photos, reports, receipts and other records you are authorised to share.' },
    ],
  },
  {
    slug: 'workflow-tracking',
    href: '/services/workflow-tracking',
    title: 'Workflow & Tracking',
    shortDescription: 'Track actions, updates and authorised follow-ups more clearly.',
    metaTitle: 'Claims Workflow and Progress Tracking | Banyan Claims',
    metaDescription: 'Structured claims workflow support, action tracking, status updates and authorised follow-up support.',
    h1: 'Workflow and Progress Tracking',
    hero: 'Keep documents, actions and updates in one clearer process.',
    whatYouReceive: 'A clearer record of actions, updates, outstanding items and agreed next steps.',
    boundary: 'Insurers and other authorised parties remain responsible for claim decisions, settlement and payment.',
    cta: 'Request Workflow Support',
    icon: ArrowPathIcon,
    bullets: [
      'Maintain an action and document-request register.',
      'Track agreed updates and outstanding items.',
      'Provide structured status summaries.',
      'Support follow-up and communication where duly authorised by the client.',
    ],
    faqs: [
      { question: 'Does Banyan contact insurers automatically?', answer: 'No. External communication is undertaken only where the client has duly authorised Banyan and it falls within the agreed scope.' },
      { question: 'What does workflow tracking include?', answer: 'It may include action logs, document requests, status summaries, outstanding items and agreed next steps.' },
      { question: 'Does tracking mean Banyan controls insurer timelines?', answer: 'No. Banyan tracks the support workflow; insurers and other relevant parties control their own decisions and response times.' },
    ],
  },
  {
    slug: 'training-research',
    href: '/training-research',
    title: 'Training & Research',
    shortDescription: 'Workshops, process reviews and claims capability for organisations.',
    metaTitle: 'Claims Training and Research | Banyan Claims Nigeria',
    metaDescription: 'Claims training, process review, consumer education and practical research for businesses and organisations in Nigeria.',
    h1: 'Research, Training and Capacity Building',
    hero: 'Practical claims knowledge and process improvement for organisations.',
    whatYouReceive: 'A scoped programme, process review or research output agreed for your organisation.',
    boundary: 'Training and research are educational and project services. They do not replace legal, broking or loss-adjusting advice.',
    cta: 'Discuss Training or Research',
    icon: AcademicCapIcon,
    bullets: [
      'Practical sessions on claims documentation, communication, readiness and workflow.',
      'Review existing claims processes and develop clearer operating guidance.',
      'Plain-language sessions that improve claims awareness and preparation.',
      'Focused research, surveys and practical findings for agreed organisational questions.',
    ],
    faqs: [
      { question: 'Who is training for?', answer: 'Businesses, associations, teams and organisations seeking stronger claims knowledge or processes.' },
      { question: 'Can a programme be tailored?', answer: 'Yes. Scope, audience, format and objectives are agreed before delivery.' },
      { question: 'Is the training legal advice?', answer: 'No. Training and research are educational and project services and do not replace professional legal advice.' },
    ],
  },
];

export const serviceBySlug = Object.fromEntries(
  servicePillars.map((service) => [service.slug, service]),
) as Record<string, ServicePillar>;
