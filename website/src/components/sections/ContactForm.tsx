'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { contactFormSchema, type ContactFormData } from '@/lib/validation';
import { submitContactForm } from '@/app/actions/contact';
import { Button } from '@/components/ui/Button';
import { getAnalyticsAttribution, getAnalyticsIdentity } from '@/lib/analytics';
import { trackFormStart } from '@/lib/tracking';

const inputClasses =
  'w-full min-h-14 bg-[var(--surface-panel)] border border-white/12 rounded-[2px] px-4 py-3.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[var(--accent)]/65 focus:bg-[var(--surface-card)] transition-colors';

const selectClasses =
  'w-full min-h-14 bg-[var(--surface-panel)] border border-white/12 rounded-[2px] px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[var(--accent)]/65 transition-colors appearance-none';

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="text-rose-400 text-xs ml-1 mt-1 font-medium">
      {message}
    </p>
  );
}

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="font-mono text-xs uppercase tracking-[0.16em] font-semibold text-white/48">
      {children}
    </label>
  );
}

function makeSubmissionId() {
  return window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const formStarted = useRef(false);
  const submitStatusRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { submissionId: '', sessionId: '', visitorId: '' },
    // No preselected service/budget/timeline — preselections pollute lead
    // data with defaults the visitor never chose.
  });

  useEffect(() => {
    setValue('submissionId', makeSubmissionId());
    const identity = getAnalyticsIdentity();
    setValue('sessionId', identity.sessionId ?? '');
    setValue('visitorId', identity.visitorId ?? '');
    const attribution = getAnalyticsAttribution();
    setValue('sourcePage', window.location.pathname);
    setValue('landingPage', attribution.landingPage);
    setValue('referrer', attribution.referrer.slice(0, 500));
    setValue('utmSource', attribution.utmSource ?? '');
    setValue('utmMedium', attribution.utmMedium ?? '');
    setValue('utmCampaign', attribution.utmCampaign ?? '');
    setValue('utmTerm', attribution.utmTerm ?? '');
    setValue('utmContent', attribution.utmContent ?? '');
  }, [setValue]);

  useEffect(() => {
    if (submitStatus) {
      submitStatusRef.current?.focus();
    }
  }, [submitStatus]);

  const handleFormFocus = () => {
    if (formStarted.current) return;
    formStarted.current = true;
    trackFormStart('contact_page_form');
  };

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const result = await submitContactForm(data);
      if (result.success) {
        setSubmitStatus({ success: true, message: result.message || 'Thank you. We will reach out soon.' });
        reset();
        setValue('submissionId', makeSubmissionId());
        const identity = getAnalyticsIdentity();
        setValue('sessionId', identity.sessionId ?? '');
        setValue('visitorId', identity.visitorId ?? '');
        const attribution = getAnalyticsAttribution();
        setValue('sourcePage', window.location.pathname);
        setValue('landingPage', attribution.landingPage);
        setValue('referrer', attribution.referrer.slice(0, 500));
        setValue('utmSource', attribution.utmSource ?? '');
        setValue('utmMedium', attribution.utmMedium ?? '');
        setValue('utmCampaign', attribution.utmCampaign ?? '');
        setValue('utmTerm', attribution.utmTerm ?? '');
        setValue('utmContent', attribution.utmContent ?? '');
        formStarted.current = false;
      } else {
        setSubmitStatus({ success: false, message: result.error || 'Something went wrong. Please try again.' });
      }
    } catch {
      setSubmitStatus({ success: false, message: 'Unexpected error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full border border-white/10 bg-[var(--surface-card)]">
      <div className="p-5 sm:p-8 lg:p-10">
        <AnimatePresence mode="wait">
          {submitStatus?.success ? (
            <motion.div
              ref={submitStatusRef}
              tabIndex={-1}
              role="status"
              aria-live="polite"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="py-12 text-center focus:outline-none focus:ring-2 focus:ring-primary/70"
            >
              <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center border border-primary/30 bg-primary/10 text-primary">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Brief received</h3>
              <p className="text-white/60 mb-10 max-w-sm mx-auto">{submitStatus.message}</p>
              <Button
                label="Send Another"
                variant="secondary"
                size="default"
                onClick={() => setSubmitStatus(null)}
                trackingSource="contact_form_reset"
              />
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit(onSubmit)}
              onFocusCapture={handleFormFocus}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <FieldLabel htmlFor="contact-name">Full Name</FieldLabel>
                  <input
                    id="contact-name"
                    {...register('name')}
                    placeholder="Your name"
                    required
                    aria-required="true"
                    aria-invalid={errors.name ? true : undefined}
                    aria-describedby={errors.name ? 'contact-name-error' : undefined}
                    className={`${inputClasses} ${errors.name ? 'border-rose-500/50' : ''}`}
                  />
                  <FieldError id="contact-name-error" message={errors.name?.message} />
                </div>

                <div className="space-y-2">
                  <FieldLabel htmlFor="contact-email">Email Address</FieldLabel>
                  <input
                    id="contact-email"
                    {...register('email')}
                    type="email"
                    placeholder="name@company.com"
                    required
                    aria-required="true"
                    aria-invalid={errors.email ? true : undefined}
                    aria-describedby={errors.email ? 'contact-email-error' : undefined}
                    className={`${inputClasses} ${errors.email ? 'border-rose-500/50' : ''}`}
                  />
                  <FieldError id="contact-email-error" message={errors.email?.message} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <FieldLabel htmlFor="contact-phone">Contact Number</FieldLabel>
                  <input
                    id="contact-phone"
                    {...register('phone')}
                    type="tel"
                    placeholder="+91 79848 91664"
                    required
                    aria-required="true"
                    aria-invalid={errors.phone ? true : undefined}
                    aria-describedby={errors.phone ? 'contact-phone-error' : undefined}
                    className={`${inputClasses} ${errors.phone ? 'border-rose-500/50' : ''}`}
                  />
                  <FieldError id="contact-phone-error" message={errors.phone?.message} />
                </div>

                <div className="space-y-2">
                  <FieldLabel htmlFor="contact-country">Country</FieldLabel>
                  <input
                    id="contact-country"
                    {...register('country')}
                    placeholder="India or United States"
                    className={inputClasses}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <FieldLabel htmlFor="contact-company">Company</FieldLabel>
                  <input
                    id="contact-company"
                    {...register('company')}
                    placeholder="Company or clinic name"
                    className={inputClasses}
                  />
                </div>

                <div className="space-y-2">
                  <FieldLabel htmlFor="contact-company-website">Company Website</FieldLabel>
                  <input
                    id="contact-company-website"
                    {...register('companyWebsite')}
                    placeholder="https://example.com"
                    aria-invalid={errors.companyWebsite ? true : undefined}
                    aria-describedby={errors.companyWebsite ? 'contact-company-website-error' : undefined}
                    className={`${inputClasses} ${errors.companyWebsite ? 'border-rose-500/50' : ''}`}
                  />
                  <FieldError id="contact-company-website-error" message={errors.companyWebsite?.message} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <FieldLabel htmlFor="contact-service">Service Required</FieldLabel>
                  <select
                    id="contact-service"
                    {...register('service')}
                    required
                    aria-required="true"
                    aria-invalid={errors.service ? true : undefined}
                    aria-describedby={errors.service ? 'contact-service-error' : undefined}
                    defaultValue=""
                    className={`${selectClasses} ${errors.service ? 'border-rose-500/50' : ''}`}
                  >
                    <option value="" disabled>Select a service…</option>
                    <option value="healthcare">Healthcare Systems</option>
                    <option value="ecommerce">E-commerce Systems</option>
                    <option value="hrms">HRMS and Payroll</option>
                    <option value="custom_systems">Custom Systems</option>
                    <option value="consulting">Architecture Consulting</option>
                    <option value="other">Other Inquiry</option>
                  </select>
                  <FieldError id="contact-service-error" message={errors.service ? 'Select a service' : undefined} />
                </div>

                <div className="space-y-2">
                  <FieldLabel htmlFor="contact-budget">Budget</FieldLabel>
                  <select
                    id="contact-budget"
                    {...register('budget', { setValueAs: (v) => (v === '' ? undefined : v) })}
                    defaultValue=""
                    className={selectClasses}
                  >
                    <option value="">Select…</option>
                    <option value="under_2000">$1k-$2k</option>
                    <option value="2000_3000">$2k-$3k</option>
                    <option value="3000_5000">$3k-$5k</option>
                    <option value="above_5000">$5k+</option>
                    <option value="unknown">Not sure</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <FieldLabel htmlFor="contact-timeline">Timeline</FieldLabel>
                  <select
                    id="contact-timeline"
                    {...register('timeline', { setValueAs: (v) => (v === '' ? undefined : v) })}
                    defaultValue=""
                    className={selectClasses}
                  >
                    <option value="">Select…</option>
                    <option value="asap">ASAP</option>
                    <option value="this_month">This month</option>
                    <option value="this_quarter">This quarter</option>
                    <option value="flexible">Flexible</option>
                    <option value="unknown">Not sure</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <FieldLabel htmlFor="contact-message">Project Details</FieldLabel>
                <textarea
                  id="contact-message"
                  {...register('message')}
                  rows={5}
                  placeholder="Tell us what system you need, who will use it, and what outcome matters most."
                  required
                  aria-required="true"
                  aria-invalid={errors.message ? true : undefined}
                  aria-describedby={errors.message ? 'contact-message-error' : undefined}
                  className={`${inputClasses} resize-none ${errors.message ? 'border-rose-500/50' : ''}`}
                />
                <FieldError id="contact-message-error" message={errors.message?.message} />
              </div>

              <input type="hidden" {...register('submissionId')} />
              <input type="hidden" {...register('sessionId')} />
              <input type="hidden" {...register('visitorId')} />
              <input type="hidden" {...register('sourcePage')} />
              <input type="hidden" {...register('landingPage')} />
              <input type="hidden" {...register('referrer')} />
              <input type="hidden" {...register('utmSource')} />
              <input type="hidden" {...register('utmMedium')} />
              <input type="hidden" {...register('utmCampaign')} />
              <input type="hidden" {...register('utmTerm')} />
              <input type="hidden" {...register('utmContent')} />

              <div className="hidden opacity-0 pointer-events-none absolute -left-[9999px]">
                <input {...register('website')} tabIndex={-1} autoComplete="off" />
              </div>

              {submitStatus && !submitStatus.success && (
                <div
                  ref={submitStatusRef}
                  tabIndex={-1}
                  role="alert"
                  className="border border-rose-500/20 bg-rose-500/10 p-4 text-center text-xs text-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-400/70"
                >
                  {submitStatus.message}
                </div>
              )}

              <div className="pt-4">
                <Button
                  type="submit"
                  label={isSubmitting ? 'Submitting...' : 'Submit Project Brief'}
                  variant="primary"
                  size="large"
                  className="w-full justify-center"
                  disabled={isSubmitting}
                  trackingSource="contact_form_submit"
                />
                <p className="text-center mt-6 text-xs text-white/60 uppercase tracking-[0.18em] font-medium">
                  Founder-led review for qualified projects
                </p>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
