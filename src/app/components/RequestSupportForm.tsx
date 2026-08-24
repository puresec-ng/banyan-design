'use client';

import { useState } from 'react';
import { requestSupport, SupportServiceCode } from '../services/public';

const serviceOptions = [
  { code: 'claims_advisory', label: 'Claims Advisory' },
  { code: 'documentation_support', label: 'Documentation Support' },
  { code: 'workflow_tracking', label: 'Workflow & Tracking' },
  { code: 'training_capacity_building', label: 'Training / Capacity Building' },
  { code: 'research_process_review', label: 'Research / Process Review' },
  { code: 'general_enquiry', label: 'General Enquiry' },
] as const;

const organisationServices = new Set<SupportServiceCode>(['training_capacity_building', 'research_process_review']);

function getTextField(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

export default function RequestSupportForm() {
  const [service, setService] = useState<SupportServiceCode | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  const isOrganisationRequest = service !== '' && organisationServices.has(service);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: null, message: '' });

    const form = event.currentTarget;
    const formData = new FormData(form);
    const participantText = getTextField(formData, 'participant_estimate');
    const participantEstimate = participantText ? Number.parseInt(participantText, 10) : null;

    try {
      const response = await requestSupport({
        service_code: service as SupportServiceCode,
        name: getTextField(formData, 'name') || '',
        organisation: getTextField(formData, 'organisation'),
        email: getTextField(formData, 'email') || '',
        phone: getTextField(formData, 'phone'),
        summary: isOrganisationRequest ? null : getTextField(formData, 'summary'),
        objective: isOrganisationRequest ? getTextField(formData, 'objective') : null,
        preferred_date: getTextField(formData, 'preferred_date'),
        location: getTextField(formData, 'location'),
        participant_estimate: isOrganisationRequest && Number.isInteger(participantEstimate) ? participantEstimate : null,
        message: getTextField(formData, 'message'),
        privacy_consent: formData.get('privacy_consent') === 'true',
        privacy_notice_version: '2026-08-17',
        source: 'website',
      });
      form.reset();
      setService('');
      const reference = response.data?.reference;
      setStatus({ type: 'success', message: reference ? `Support request ${reference} received. We will contact you about next steps.` : 'Support request received. We will review the information provided and contact you about next steps.' });
    } catch {
      setStatus({ type: 'error', message: 'We could not send your support request. Please check the form and try again.' });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
      {status.type && (
        <div role="status" className={`rounded-lg p-4 text-sm ${status.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {status.message}
        </div>
      )}

      <div>
        <label htmlFor="support-service" className="form-label">What support do you need?</label>
        <select id="support-service" name="service" required value={service} onChange={(event) => setService(event.target.value as SupportServiceCode | '')} className="form-input">
          <option value="">Choose a service</option>
          {serviceOptions.map((option) => <option key={option.code} value={option.code}>{option.label}</option>)}
        </select>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="support-name" className="form-label">Name</label>
          <input id="support-name" name="name" required className="form-input" />
        </div>
        <div>
          <label htmlFor="support-organisation" className="form-label">Organisation <span className="font-normal text-gray-500">(optional)</span></label>
          <input id="support-organisation" name="organisation" className="form-input" />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="support-email" className="form-label">Email</label>
          <input id="support-email" name="email" type="email" required className="form-input" />
        </div>
        <div>
          <label htmlFor="support-phone" className="form-label">Phone <span className="font-normal text-gray-500">(optional)</span></label>
          <input id="support-phone" name="phone" type="tel" className="form-input" />
        </div>
      </div>

      {isOrganisationRequest ? (
        <>
          <div>
            <label htmlFor="support-objective" className="form-label">Audience or objective</label>
            <textarea id="support-objective" name="objective" required rows={4} className="form-input" placeholder="Tell us who the programme is for and what you want to achieve." />
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label htmlFor="support-date" className="form-label">Preferred date <span className="font-normal text-gray-500">(optional)</span></label>
              <input id="support-date" name="preferred_date" type="date" className="form-input" />
            </div>
            <div>
              <label htmlFor="support-location" className="form-label">Location / virtual</label>
              <input id="support-location" name="location" className="form-input" />
            </div>
            <div>
              <label htmlFor="support-participants" className="form-label">Participants <span className="font-normal text-gray-500">(optional)</span></label>
              <input id="support-participants" name="participant_estimate" type="number" min="1" className="form-input" />
            </div>
          </div>
          <p className="rounded-lg bg-[#F8FAF9] p-4 text-sm leading-6 text-gray-600">
            Training and research enquiries do not require incident, policy, medical, identity, banking or claim documents at this stage.
          </p>
        </>
      ) : (
        <>
          <div>
            <label htmlFor="support-summary" className="form-label">Short summary</label>
            <textarea id="support-summary" name="summary" required rows={5} className="form-input" placeholder="Share only what is needed at this stage." />
          </div>
          <p className="rounded-lg bg-[#F8FAF9] p-4 text-sm leading-6 text-gray-600">
            Supporting documents are not required for this first request. If needed, we will explain what to share and how to share it after scope is confirmed.
          </p>
        </>
      )}

      <div>
        <label htmlFor="support-message" className="form-label">Additional message <span className="font-normal text-gray-500">(optional)</span></label>
        <textarea id="support-message" name="message" rows={3} className="form-input" />
      </div>

      <label className="flex items-start gap-3 text-sm leading-6 text-gray-600">
        <input type="checkbox" name="privacy_consent" value="true" required className="mt-1 h-4 w-4 rounded border-gray-300 text-[#1B4332] focus:ring-[#1B4332]" />
        <span>I confirm that the information provided is accurate to the best of my knowledge and that I have read the <a href="/privacy" className="font-medium text-[#1B4332] underline">Privacy Notice</a>.</span>
      </label>

      <button type="submit" disabled={isSubmitting} className="btn-secondary w-full disabled:cursor-not-allowed disabled:opacity-60">
        {isSubmitting ? 'Sending…' : 'Send Support Request'}
      </button>
    </form>
  );
}
