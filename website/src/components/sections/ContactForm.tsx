'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { contactFormSchema, type ContactFormData } from '@/lib/validation';
import { submitContactForm } from '@/app/actions/contact';
import { Button } from '@/components/ui/Button';
import { trackFormSubmit } from '@/lib/tracking';

/**
 * Premium Contact Form for automated lead capture.
 * Features:
 * - Glassmorphism UI
 * - Zod Validation
 * - Honeypot Spam Protection
 * - Server Actions
 * - Tracking Integration
 */
export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const result = await submitContactForm(data);
      if (result.success) {
        setSubmitStatus({ success: true, message: result.message || 'Thank you! We will reach out soon.' });
        reset();
        trackFormSubmit('contact_page_form');
      } else {
        setSubmitStatus({ success: false, message: result.error || 'Something went wrong. Please try again.' });
      }
    } catch (err) {
      setSubmitStatus({ success: false, message: 'Unexpected error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-1 bg-white/[0.03] rounded-[2.5rem] border border-white/10 backdrop-blur-3xl shadow-[0_0_80px_var(--color-primary-glow)]">
      <div className="p-8 sm:p-12">
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
              className="space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 ml-1">Full Name</label>
                  <input
                    {...register('name')}
                    placeholder="Your Name"
                    className={`w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/20 focus:outline-none focus:border-teal/50 focus:bg-white/[0.05] transition-all ${errors.name ? 'border-rose-500/50' : ''}`}
                  />
                  {errors.name && <p className="text-rose-500 text-[10px] ml-1 mt-1 font-medium">{errors.name.message}</p>}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 ml-1">Email Address</label>
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="name@company.com"
                    className={`w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/20 focus:outline-none focus:border-teal/50 focus:bg-white/[0.05] transition-all ${errors.email ? 'border-rose-500/50' : ''}`}
                  />
                  {errors.email && <p className="text-rose-500 text-[10px] ml-1 mt-1 font-medium">{errors.email.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 ml-1">Contact Number</label>
                  <input
                    {...register('phone')}
                    placeholder="+91 00000 00000"
                    className={`w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/20 focus:outline-none focus:border-teal/50 focus:bg-white/[0.05] transition-all ${errors.phone ? 'border-rose-500/50' : ''}`}
                  />
                  {errors.phone && <p className="text-rose-500 text-[10px] ml-1 mt-1 font-medium">{errors.phone.message}</p>}
                </div>

                {/* Service Interest */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 ml-1">Service Required</label>
                  <select
                    {...register('service')}
                    className={`w-full bg-white/[0.05] border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-teal/50 transition-all appearance-none ${errors.service ? 'border-rose-500/50' : ''}`}
                  >
                    <option value="healthcare">Healthcare Systems</option>
                    <option value="ecommerce">E-Commerce Platforms</option>
                    <option value="hrms">Enterprise HRMS</option>
                    <option value="consulting">Performance Consulting</option>
                    <option value="other">Other Inquiry</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 ml-1">Project Details</label>
                <textarea
                  {...register('message')}
                  rows={4}
                  placeholder="Tell us about the system you want to build..."
                  className={`w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/20 focus:outline-none focus:border-teal/50 focus:bg-white/[0.05] transition-all resize-none ${errors.message ? 'border-rose-500/50' : ''}`}
                />
                {errors.message && <p className="text-rose-500 text-[10px] ml-1 mt-1 font-medium">{errors.message.message}</p>}
              </div>

              {/* Honeypot field (hidden) */}
              <div className="hidden opacity-0 pointer-events-none absolute -left-[9999px]">
                <input {...register('website')} tabIndex={-1} autoComplete="off" />
              </div>

              {submitStatus && !submitStatus.success && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-xs text-center">
                  {submitStatus.message}
                </div>
              )}

              <div className="pt-4">
                <Button
                  label={isSubmitting ? "Dispatching..." : "Initialize Architecture Inquiry"}
                  variant="primary"
                  size="large"
                  className="w-full justify-center shadow-[0_0_40px_-5px_rgba(20,184,166,0.2)]"
                  disabled={isSubmitting}
                  trackingSource="contact_form_submit"
                />
                <p className="text-center mt-6 text-[10px] text-white/20 uppercase tracking-[0.2em] font-medium">
                  Founder-Led Interaction Guaranteed
                </p>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
