'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { contactFormSchema, type ContactFormData } from '@/lib/validation';
import { submitContactForm } from '@/app/actions/contact';
import { Button } from '@/components/ui/Button';
import { trackFormStart, trackFormSubmit } from '@/lib/tracking';

const inputClasses =
  'w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-white/20 focus:outline-none focus:border-teal/50 focus:bg-white/[0.05] transition-all';

const selectClasses =
  'w-full bg-[#101522] border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-teal/50 transition-all appearance-none';

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-rose-400 text-[10px] ml-1 mt-1 font-medium">{message}</p>;
}

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="text-[10px] uppercase tracking-widest font-bold text-white/40 ml-1">
      {children}
    </label>
  );
}

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const formStarted = useRef(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      service: 'healthcare',
      budget: 'under_2000',
      timeline: 'this_month',
      country: 'India',
    },
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setValue('sourcePage', window.location.pathname);
    setValue('referrer', document.referrer);
    setValue('utmSource', params.get('utm_source') ?? '');
    setValue('utmMedium', params.get('utm_medium') ?? '');
    setValue('utmCampaign', params.get('utm_campaign') ?? '');
    setValue('utmTerm', params.get('utm_term') ?? '');
    setValue('utmContent', params.get('utm_content') ?? '');
  }, [setValue]);

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
        trackFormSubmit('contact_page_form');
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
    <div className="w-full max-w-2xl mx-auto p-1 bg-white/[0.03] rounded-[2rem] border border-white/10 backdrop-blur-3xl shadow-[0_0_80px_var(--color-primary-glow)]">
      <div className="p-6 sm:p-10">
        <AnimatePresence mode="wait">
          {submitStatus?.success ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="py-12 text-center"
            >
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-8 text-primary">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Inquiry Received</h3>
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
                    className={`${inputClasses} ${errors.name ? 'border-rose-500/50' : ''}`}
                  />
                  <FieldError message={errors.name?.message} />
                </div>

                <div className="space-y-2">
                  <FieldLabel htmlFor="contact-email">Email Address</FieldLabel>
                  <input
                    id="contact-email"
                    {...register('email')}
                    type="email"
                    placeholder="name@company.com"
                    className={`${inputClasses} ${errors.email ? 'border-rose-500/50' : ''}`}
                  />
                  <FieldError message={errors.email?.message} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <FieldLabel htmlFor="contact-phone">Contact Number</FieldLabel>
                  <input
                    id="contact-phone"
                    {...register('phone')}
                    placeholder="+91 79848 91664"
                    className={`${inputClasses} ${errors.phone ? 'border-rose-500/50' : ''}`}
                  />
                  <FieldError message={errors.phone?.message} />
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
                    className={`${inputClasses} ${errors.companyWebsite ? 'border-rose-500/50' : ''}`}
                  />
                  <FieldError message={errors.companyWebsite?.message} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <FieldLabel htmlFor="contact-service">Service Required</FieldLabel>
                  <select
                    id="contact-service"
                    {...register('service')}
                    className={`${selectClasses} ${errors.service ? 'border-rose-500/50' : ''}`}
                  >
                    <option value="healthcare">Healthcare Systems</option>
                    <option value="ecommerce">E-commerce Systems</option>
                    <option value="hrms">HRMS and Payroll</option>
                    <option value="custom_systems">Custom Systems</option>
                    <option value="consulting">Architecture Consulting</option>
                    <option value="other">Other Inquiry</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <FieldLabel htmlFor="contact-budget">Budget</FieldLabel>
                  <select id="contact-budget" {...register('budget')} className={selectClasses}>
                    <option value="under_2000">$1k-$2k</option>
                    <option value="2000_3000">$2k-$3k</option>
                    <option value="3000_5000">$3k-$5k</option>
                    <option value="above_5000">$5k+</option>
                    <option value="unknown">Not sure</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <FieldLabel htmlFor="contact-timeline">Timeline</FieldLabel>
                  <select id="contact-timeline" {...register('timeline')} className={selectClasses}>
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
                  className={`${inputClasses} resize-none ${errors.message ? 'border-rose-500/50' : ''}`}
                />
                <FieldError message={errors.message?.message} />
              </div>

              <input type="hidden" {...register('sourcePage')} />
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
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-xs text-center">
                  {submitStatus.message}
                </div>
              )}

              <div className="pt-4">
                <Button
                  type="submit"
                  label={isSubmitting ? 'Submitting...' : 'Request Architecture Review'}
                  variant="primary"
                  size="large"
                  className="w-full justify-center shadow-[0_0_40px_-5px_rgba(20,184,166,0.2)]"
                  disabled={isSubmitting}
                  trackingSource="contact_form_submit"
                />
                <p className="text-center mt-6 text-[10px] text-white/30 uppercase tracking-[0.18em] font-medium">
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
