'use client';

import { useState } from 'react';
import { contactUs } from '../services/public';

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: null, message: '' });

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      await contactUs({
        name: formData.get('name'),
        organisation: formData.get('organisation'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        enquiry_type: formData.get('enquiry_type'),
        message: formData.get('message'),
      });
      form.reset();
      setStatus({ type: 'success', message: 'Thank you. Your enquiry has been received and we will contact you about next steps.' });
    } catch {
      setStatus({ type: 'error', message: 'We could not send your enquiry. Please check the form and try again.' });
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
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="form-label">Name</label>
          <input id="contact-name" name="name" required className="form-input" />
        </div>
        <div>
          <label htmlFor="contact-organisation" className="form-label">Organisation <span className="font-normal text-gray-500">(optional)</span></label>
          <input id="contact-organisation" name="organisation" className="form-input" />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-email" className="form-label">Email</label>
          <input id="contact-email" name="email" type="email" required className="form-input" />
        </div>
        <div>
          <label htmlFor="contact-phone" className="form-label">Phone <span className="font-normal text-gray-500">(optional)</span></label>
          <input id="contact-phone" name="phone" type="tel" className="form-input" />
        </div>
      </div>
      <div>
        <label htmlFor="contact-enquiry-type" className="form-label">Enquiry type</label>
        <select id="contact-enquiry-type" name="enquiry_type" required className="form-input">
          <option value="">Choose an option</option>
          <option>Claims Advisory</option>
          <option>Documentation Support</option>
          <option>Workflow &amp; Tracking</option>
          <option>Training</option>
          <option>Research / Process Review</option>
          <option>General Enquiry</option>
        </select>
      </div>
      <div>
        <label htmlFor="contact-message" className="form-label">Message</label>
        <textarea id="contact-message" name="message" required rows={5} className="form-input" />
      </div>
      <button type="submit" disabled={isSubmitting} className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60">
        {isSubmitting ? 'Sending…' : 'Send Enquiry'}
      </button>
    </form>
  );
}
